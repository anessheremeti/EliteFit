using EliteFit.Domain.Entities;
using EliteFit.Domain.Entities.Mongo;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Persistence.Context
{
    // Parametri (options) vendoset direkt këtu
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : DbContext(options)
    {
        // Regjistrimi i tabelave
        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Allergy> Allergies { get; set; }
        public DbSet<Badge> Badges { get; set; }
        public DbSet<ExerciseCategory> ExerciseCategories { get; set; }
        public DbSet<FileEntity> Files { get; set; }
        public DbSet<Goal> Goals { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<WorkoutVideo> WorkoutVideos { get; set; }
        public DbSet<UserStreak> UserStreaks { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<UserAllergy> UserAllergies { get; set; }
        public DbSet<UserBadge> UserBadges { get; set; }
        public DbSet<UserGoal> UserGoals { get; set; }
        public DbSet<UserWorkoutHistory> UserWorkoutHistories { get; set; }
        public DbSet<RecipeAllergenInfo> RecipeAllergens { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Setting> Settings { get; set; }
        public DbSet<QuickFixTip> QuickFixTips { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map User entity explicitly to legacy snake_case MySQL schema.
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

            // Current DB schema does not include BaseEntity user tracking columns yet.
            // Ignore them so EF doesn't generate inserts/updates for missing fields.
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var clrType = entityType.ClrType;
                if (clrType is null || !typeof(BaseEntity).IsAssignableFrom(clrType))
                {
                    continue;
                }

                if (clrType != typeof(User))
                {
                    modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.CreatedAt));
                    modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.UpdatedAt));
                }
                modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.CreatedBy));
                modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.UpdatedBy));
            }

            // Konfigurimet për Primary Keys që nuk janë "Id"
            modelBuilder.Entity<UserStreak>().HasKey(us => us.UserId);

            // user_profiles — explicit snake_case mapping
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

            // goals — explicit snake_case mapping
            modelBuilder.Entity<Goal>(entity =>
            {
                entity.ToTable("goals");
                entity.Property(g => g.Id).HasColumnName("id");
                entity.Property(g => g.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
                entity.Property(g => g.CreatedAt).HasColumnName("created_at");
            });

            // user_goals — explicit snake_case mapping
            modelBuilder.Entity<UserGoal>(entity =>
            {
                entity.ToTable("user_goals");
                entity.Property(ug => ug.Id).HasColumnName("id");
                entity.Property(ug => ug.UserId).HasColumnName("user_id");
                entity.Property(ug => ug.GoalId).HasColumnName("goal_id");

                entity.HasOne(ug => ug.User)
                    .WithMany(u => u.UserGoals)
                    .HasForeignKey(ug => ug.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ug => ug.Goal)
                    .WithMany(g => g.UserGoals)
                    .HasForeignKey(ug => ug.GoalId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // allergies — explicit snake_case mapping
            modelBuilder.Entity<Allergy>(entity =>
            {
                entity.ToTable("allergies");
                entity.Property(a => a.Id).HasColumnName("id");
                entity.Property(a => a.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
                entity.Property(a => a.CreatedAt).HasColumnName("created_at");
            });

            // user_allergies — explicit snake_case mapping
            modelBuilder.Entity<UserAllergy>(entity =>
            {
                entity.ToTable("user_allergies");
                entity.Property(ua => ua.Id).HasColumnName("id");
                entity.Property(ua => ua.UserId).HasColumnName("user_id");
                entity.Property(ua => ua.AllergyId).HasColumnName("allergy_id");

                entity.HasOne(ua => ua.User)
                    .WithMany(u => u.UserAllergies)
                    .HasForeignKey(ua => ua.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ua => ua.Allergy)
                    .WithMany(a => a.UserAllergies)
                    .HasForeignKey(ua => ua.AllergyId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // password_reset_tokens — explicit snake_case mapping
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
                entity.Ignore(t => t.CreatedBy);
                entity.Ignore(t => t.UpdatedBy);
                entity.Ignore(t => t.UpdatedAt);

                entity.HasOne(t => t.User)
                    .WithMany()
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(t => t.TokenHash).IsUnique();
                entity.HasIndex(t => t.UserId);
            });
        }
    }
}