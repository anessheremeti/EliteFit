using EliteFit.Domain.Entities;
using EliteFit.Domain.Entities.Mongo;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace EliteFit.Persistence.Persistence.Context
{
    public class ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IHttpContextAccessor httpContextAccessor) : DbContext(options)
    {
        private readonly IHttpContextAccessor _http = httpContextAccessor;

        // ── Table registrations ────────────────────────────────────────────────
        public DbSet<User>               Users               { get; set; }
        public DbSet<UserProfile>        UserProfiles        { get; set; }
        public DbSet<Allergy>            Allergies           { get; set; }
        public DbSet<Badge>              Badges              { get; set; }
        public DbSet<ExerciseCategory>   ExerciseCategories  { get; set; }
        public DbSet<FileEntity>         Files               { get; set; }
        public DbSet<Goal>               Goals               { get; set; }
        public DbSet<Notification>       Notifications       { get; set; }
        public DbSet<MealLog>            MealLogs            { get; set; }
        public DbSet<Recipe>             Recipes             { get; set; }
        public DbSet<WorkoutVideo>       WorkoutVideos       { get; set; }
        public DbSet<UserStreak>         UserStreaks          { get; set; }
        public DbSet<Role>               Roles               { get; set; }
        public DbSet<AuditLog>           AuditLogs           { get; set; }
        public DbSet<Permission>         Permissions         { get; set; }
        public DbSet<UserRole>           UserRoles           { get; set; }
        public DbSet<RolePermission>     RolePermissions     { get; set; }
        public DbSet<UserAllergy>        UserAllergies       { get; set; }
        public DbSet<UserBadge>          UserBadges          { get; set; }
        public DbSet<UserGoal>           UserGoals           { get; set; }
        public DbSet<UserWorkoutHistory> UserWorkoutHistories { get; set; }
        public DbSet<RecipeAllergenInfo> RecipeAllergens     { get; set; }
        public DbSet<RefreshToken>       RefreshTokens       { get; set; }
        public DbSet<Setting>            Settings            { get; set; }
        public DbSet<QuickFixTip>        QuickFixTips        { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        // ── Automatic audit-log capture ────────────────────────────────────────

        // Entity type names that should never be auto-audited.
        private static readonly HashSet<string> _skipAudit = new(StringComparer.Ordinal)
        {
            nameof(AuditLog),           // prevent recursion
            nameof(RefreshToken),       // security / noise
            nameof(PasswordResetToken), // security / noise
            nameof(Notification),       // background-service noise
            nameof(UserStreak),         // background-service noise
        };

        // Property names that hold sensitive data and must be redacted from snapshots.
        private static readonly HashSet<string> _sensitiveProps = new(StringComparer.OrdinalIgnoreCase)
        {
            "PasswordHash", "password_hash",
            "TokenHash",    "token_hash",
        };

        // Guards against the second SaveChangesAsync (that persists audit rows) re-entering the
        // collection logic and generating audit entries for AuditLog entities themselves.
        private bool _writingAuditLogs;

        public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
        {
            // Skip auto-audit when there is no active HTTP request (startup seeding, background
            // workers, EF migrations CLI) — nothing useful to capture and no caller identity.
            var httpCtx = _http.HttpContext;
            if (httpCtx is null || _writingAuditLogs)
                return await base.SaveChangesAsync(ct);

            var auditRows = CollectAuditRows(httpCtx);
            var result    = await base.SaveChangesAsync(ct);

            if (auditRows.Count > 0)
            {
                try
                {
                    _writingAuditLogs = true;
                    AuditLogs.AddRange(auditRows);
                    await base.SaveChangesAsync(ct);
                }
                catch (Exception ex)
                {
                    // Audit failures must NEVER surface to callers or break business operations.
                    Console.Error.WriteLine($"[AuditLog] Auto-capture failed: {ex.Message}");
                }
                finally
                {
                    _writingAuditLogs = false;
                }
            }

            return result;
        }

        private List<AuditLog> CollectAuditRows(HttpContext httpCtx)
        {
            // Extract caller identity from the JWT claims present on the request.
            var userId   = int.TryParse(httpCtx.User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : (int?)null;
            var userName = httpCtx.User.FindFirstValue(ClaimTypes.Name);
            var ip       = httpCtx.Connection.RemoteIpAddress?.ToString();
            var endpoint = httpCtx.Request.Path.Value;
            var method   = httpCtx.Request.Method;
            var traceId  = httpCtx.TraceIdentifier;

            var rows = new List<AuditLog>();

            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.State is not (EntityState.Added or EntityState.Modified or EntityState.Deleted))
                    continue;

                var entityName = entry.Entity.GetType().Name;
                if (_skipAudit.Contains(entityName))
                    continue;

                var action = entry.State switch
                {
                    EntityState.Added    => "Created",
                    EntityState.Modified => "Updated",
                    EntityState.Deleted  => "Deleted",
                    _                    => null
                };
                if (action is null) continue;

                // Resolve the integer primary-key value (string PKs map to null).
                var pkProp = entry.Properties.FirstOrDefault(p => p.Metadata.IsPrimaryKey());
                int? entityId = pkProp?.CurrentValue switch
                {
                    int i  => i,
                    long l => (int)l,
                    _      => null
                };

                string? oldJson = null;
                string? newJson = null;

                if (entry.State is EntityState.Modified or EntityState.Deleted)
                {
                    var changed = entry.Properties
                        .Where(p => p.IsModified || entry.State == EntityState.Deleted)
                        .Where(p => !_sensitiveProps.Contains(p.Metadata.Name))
                        .ToDictionary(p => p.Metadata.Name, p => p.OriginalValue);

                    oldJson = changed.Count > 0 ? JsonSerializer.Serialize(changed) : null;
                }

                if (entry.State is EntityState.Modified or EntityState.Added)
                {
                    var current = entry.Properties
                        .Where(p => p.IsModified || entry.State == EntityState.Added)
                        .Where(p => !_sensitiveProps.Contains(p.Metadata.Name))
                        .ToDictionary(p => p.Metadata.Name, p => p.CurrentValue);

                    newJson = current.Count > 0 ? JsonSerializer.Serialize(current) : null;
                }

                rows.Add(new AuditLog
                {
                    Id         = Guid.NewGuid().ToString("N"),
                    UserId     = userId,
                    UserName   = userName,
                    Action     = action,
                    Entity     = entityName,
                    EntityId   = entityId,
                    OldValue   = oldJson,
                    NewValue   = newJson,
                    IpAddress  = ip,
                    Endpoint   = endpoint,
                    HttpMethod = method,
                    TraceId    = traceId,
                    CreatedAt  = DateTime.UtcNow,
                });
            }

            return rows;
        }

        // ── Model configuration ───────────────────────────────────────────────

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ignore BaseEntity shadow properties that have no matching DB columns.
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var clrType = entityType.ClrType;
                if (clrType is null || !typeof(BaseEntity).IsAssignableFrom(clrType))
                    continue;

                if (clrType != typeof(User))
                {
                    if (clrType != typeof(Notification))
                        modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.CreatedAt));

                    modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.UpdatedAt));
                }
                modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.CreatedBy));
                modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.UpdatedBy));
            }

            // ── audit_logs ────────────────────────────────────────────────────
            modelBuilder.Entity<AuditLog>(e =>
            {
                e.ToTable("audit_logs");
                e.HasKey(a => a.Id);
                e.Property(a => a.Id).HasColumnName("id").HasMaxLength(36).IsRequired();
                e.Property(a => a.UserId).HasColumnName("user_id");
                e.Property(a => a.UserName).HasColumnName("user_name").HasMaxLength(255);
                e.Property(a => a.Action).HasColumnName("action").HasMaxLength(100);
                e.Property(a => a.Entity).HasColumnName("entity").HasMaxLength(100);
                e.Property(a => a.EntityId).HasColumnName("entity_id");
                e.Property(a => a.OldValue).HasColumnName("old_value").HasColumnType("longtext");
                e.Property(a => a.NewValue).HasColumnName("new_value").HasColumnType("longtext");
                e.Property(a => a.IpAddress).HasColumnName("ip_address").HasMaxLength(50);
                e.Property(a => a.Endpoint).HasColumnName("endpoint").HasMaxLength(500);
                e.Property(a => a.HttpMethod).HasColumnName("http_method").HasMaxLength(10);
                e.Property(a => a.TraceId).HasColumnName("trace_id").HasMaxLength(100);
                e.Property(a => a.CreatedAt).HasColumnName("created_at");

                e.HasIndex(a => a.UserId).HasDatabaseName("IX_audit_logs_user_id");
                e.HasIndex(a => a.Entity).HasDatabaseName("IX_audit_logs_entity");
                e.HasIndex(a => a.Action).HasDatabaseName("IX_audit_logs_action");
                e.HasIndex(a => a.CreatedAt).HasDatabaseName("IX_audit_logs_created_at");
            });

            // ── users ─────────────────────────────────────────────────────────
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id).HasColumnName("id");
                entity.Property(u => u.FirstName).HasColumnName("first_name");
                entity.Property(u => u.LastName).HasColumnName("last_name");
                entity.Property(u => u.Email).HasColumnName("email");
                entity.Property(u => u.PasswordHash).HasColumnName("password_hash");
                entity.Property(u => u.IsActive).HasColumnName("is_active");
                entity.Property(u => u.CreatedAt).HasColumnName("created_at");
                entity.Property(u => u.UpdatedAt).HasColumnName("updated_at");
            });

            // ── user_profiles ─────────────────────────────────────────────────
            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.ToTable("user_profiles");
                entity.HasKey(up => up.UserId);
                entity.Property(up => up.UserId).HasColumnName("user_id");
                entity.Property(up => up.Gender).HasColumnName("gender").HasMaxLength(20);
                entity.Property(up => up.Age).HasColumnName("age");
                entity.Property(up => up.WeightKg).HasColumnName("weight_kg").HasColumnType("decimal(5,2)");
                entity.Property(up => up.HeightCm).HasColumnName("height_cm").HasColumnType("decimal(5,2)");
                entity.Property(up => up.WorkoutsPerWeek).HasColumnName("workouts_per_week");
                entity.Property(up => up.MealsPerDay).HasColumnName("meals_per_day");
                entity.Property(up => up.DietType).HasColumnName("diet_type").HasMaxLength(50);
                entity.Property(up => up.OnboardingCompleted).HasColumnName("onboarding_completed");
                entity.Property(up => up.DailyCalorieTarget).HasColumnName("daily_calorie_target");

                entity.HasOne(up => up.User)
                    .WithOne(u => u.Profile)
                    .HasForeignKey<UserProfile>(up => up.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── goals & user_goals ────────────────────────────────────────────
            modelBuilder.Entity<Goal>(entity =>
            {
                entity.ToTable("goals");
                entity.Property(g => g.Id).HasColumnName("id");
                entity.Property(g => g.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
                entity.Property(g => g.CreatedAt).HasColumnName("created_at");
            });

            modelBuilder.Entity<UserGoal>(entity =>
            {
                entity.ToTable("user_goals");
                entity.Property(ug => ug.Id).HasColumnName("id");
                entity.Property(ug => ug.UserId).HasColumnName("user_id");
                entity.Property(ug => ug.GoalId).HasColumnName("goal_id");

                entity.HasOne(ug => ug.User).WithMany(u => u.UserGoals).HasForeignKey(ug => ug.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(ug => ug.Goal).WithMany(g => g.UserGoals).HasForeignKey(ug => ug.GoalId).OnDelete(DeleteBehavior.Cascade);
            });

            // ── allergies & user_allergies ────────────────────────────────────
            modelBuilder.Entity<Allergy>(entity =>
            {
                entity.ToTable("allergies");
                entity.Property(a => a.Id).HasColumnName("id");
                entity.Property(a => a.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
                entity.Property(a => a.CreatedAt).HasColumnName("created_at");
            });

            modelBuilder.Entity<UserAllergy>(entity =>
            {
                entity.ToTable("user_allergies");
                entity.Property(ua => ua.Id).HasColumnName("id");
                entity.Property(ua => ua.UserId).HasColumnName("user_id");
                entity.Property(ua => ua.AllergyId).HasColumnName("allergy_id");

                entity.HasOne(ua => ua.User).WithMany(u => u.UserAllergies).HasForeignKey(ua => ua.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(ua => ua.Allergy).WithMany(a => a.UserAllergies).HasForeignKey(ua => ua.AllergyId).OnDelete(DeleteBehavior.Cascade);
            });

            // ── password_reset_tokens ─────────────────────────────────────────
            modelBuilder.Entity<PasswordResetToken>(entity =>
            {
                entity.ToTable("password_reset_tokens");
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id).HasColumnName("id");
                entity.Property(t => t.UserId).HasColumnName("user_id");
                entity.Property(t => t.TokenHash).HasColumnName("token_hash").HasMaxLength(512).IsRequired();
                entity.Property(t => t.ExpiresAt).HasColumnName("expires_at");
                entity.Property(t => t.UsedAt).HasColumnName("used_at");
                entity.Property(t => t.CreatedAt).HasColumnName("created_at");

                entity.HasOne(t => t.User).WithMany().HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(t => t.TokenHash).IsUnique();
                entity.HasIndex(t => t.UserId);
            });

            // ── roles ─────────────────────────────────────────────────────────
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("roles");
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Id).HasColumnName("id");
                entity.Property(r => r.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
                entity.Property(r => r.Description).HasColumnName("description");
            });

            // ── user_roles ────────────────────────────────────────────────────
            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.ToTable("user_roles");
                entity.HasKey(ur => ur.Id);
                entity.Property(ur => ur.Id).HasColumnName("id");
                entity.Property(ur => ur.UserId).HasColumnName("user_id");
                entity.Property(ur => ur.RoleId).HasColumnName("role_id");
                entity.Property(ur => ur.AssignedAt).HasColumnName("assigned_at");

                entity.HasOne(ur => ur.User)
                    .WithMany(u => u.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── permissions ───────────────────────────────────────────────────
            modelBuilder.Entity<Permission>(entity =>
            {
                entity.ToTable("permissions");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id).HasColumnName("id");
                entity.Property(p => p.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
                entity.Property(p => p.Description).HasColumnName("description");
            });

            // ── user_streaks ──────────────────────────────────────────────────
            modelBuilder.Entity<UserStreak>(entity =>
            {
                entity.ToTable("user_streaks");
                entity.HasKey(us => us.UserId);
                entity.Property(us => us.UserId).HasColumnName("user_id");
                entity.Property(us => us.CurrentStreak).HasColumnName("current_streak");
                entity.Property(us => us.HighestStreak).HasColumnName("highest_streak");
                entity.Property(us => us.StreakFreezeCount).HasColumnName("streak_freeze_count");
                entity.Property(us => us.LastActivityDate).HasColumnName("last_activity_date");
                entity.Property(us => us.CreatedAt).HasColumnName("created_at");
                entity.Property(us => us.UpdatedAt).HasColumnName("updated_at");
                entity.Property(us => us.CreatedBy).HasColumnName("created_by");
                entity.Property(us => us.UpdatedBy).HasColumnName("updated_by");

                entity.HasOne(us => us.User)
                    .WithOne(u => u.Streak)
                    .HasForeignKey<UserStreak>(us => us.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── Badges ────────────────────────────────────────────────────────
            modelBuilder.Entity<Badge>(entity =>
            {
                entity.ToTable("Badges");
                entity.HasKey(b => b.Id);
                entity.Property(b => b.Id).HasColumnName("id");
                entity.Property(b => b.Name).HasColumnName("name");
                entity.Property(b => b.Description).HasColumnName("description");
                entity.Property(b => b.BadgeIconId).HasColumnName("badge_icon_id");
            });

            // ── recipe_allergens ──────────────────────────────────────────────
            modelBuilder.Entity<RecipeAllergenInfo>(entity =>
            {
                entity.ToTable("recipe_allergens");
                entity.HasKey(ra => ra.Id);
                entity.Property(ra => ra.Id).HasColumnName("id");
                entity.Property(ra => ra.RecipeId).HasColumnName("recipe_id");
                entity.Property(ra => ra.AllergyId).HasColumnName("allergy_id");

                entity.HasOne(ra => ra.Recipe)
                    .WithMany(r => r.Allergens)
                    .HasForeignKey(ra => ra.RecipeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ra => ra.Allergy)
                    .WithMany()
                    .HasForeignKey(ra => ra.AllergyId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── Recipes ───────────────────────────────────────────────────────
            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.ToTable("Recipes");
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Id).HasColumnName("id");
                entity.Property(r => r.ImageFileId).HasColumnName("image_file_id");
                entity.Property(r => r.ProteinG).HasColumnName("protein_g").HasColumnType("decimal(18,2)");
                entity.Property(r => r.CarbsG).HasColumnName("carbs_g").HasColumnType("decimal(18,2)");
                entity.Property(r => r.FatG).HasColumnName("fat_g").HasColumnType("decimal(18,2)");

                entity.HasOne(r => r.ImageFile)
                    .WithMany()
                    .HasForeignKey(r => r.ImageFileId);
            });

            // ── Files ─────────────────────────────────────────────────────────
            modelBuilder.Entity<FileEntity>(entity =>
            {
                entity.ToTable("Files");
                entity.HasKey(f => f.Id);
                entity.Property(f => f.Id).HasColumnName("id");
                entity.Property(f => f.EntityId).HasColumnName("entity_id");
                entity.Property(f => f.FilePath).HasColumnName("file_path");
                entity.Property(f => f.FileSize).HasColumnName("file_size");
                entity.Property(f => f.UploadedBy).HasColumnName("uploaded_by");

                entity.HasOne(f => f.Uploader)
                    .WithMany()
                    .HasForeignKey(f => f.UploadedBy)
                    .IsRequired(false);
            });

            // ── quick_fix_tips ────────────────────────────────────────────────
            modelBuilder.Entity<QuickFixTip>(entity =>
            {
                entity.ToTable("quick_fix_tips");
                entity.HasKey(q => q.Id);
                entity.Property(q => q.Id).HasColumnName("id");
            });

            // ── Notifications ─────────────────────────────────────────────────
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("Notifications");
                entity.HasKey(n => n.Id);
                entity.Property(n => n.CreatedAt).HasColumnName("CreatedAt");
                entity.HasOne(n => n.User)
                    .WithMany(u => u.Notifications)
                    .HasForeignKey(n => n.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
