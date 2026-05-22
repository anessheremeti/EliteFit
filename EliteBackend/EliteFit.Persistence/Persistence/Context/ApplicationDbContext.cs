using EliteFit.Domain.Entities;
using EliteFit.Domain.Entities.Mongo;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Persistence.Context
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : DbContext(options)
    {
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
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<UserWorkoutProgress> UserWorkoutProgresses { get; set; }
        public DbSet<UserWorkoutFavorite> UserWorkoutFavorites { get; set; }
        public DbSet<UserStreak> UserStreaks { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<UserAllergy> UserAllergies { get; set; }
        public DbSet<UserBadge> UserBadges { get; set; }
        public DbSet<UserGoal> UserGoals { get; set; }
        public DbSet<ExerciseLog> ExerciseLogs { get; set; }
        public DbSet<RecipeAllergenInfo> RecipeAllergens { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Setting> Settings { get; set; }
        public DbSet<QuickFixTip> QuickFixTips { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Entities that keep CreatedAt/UpdatedAt mapped (others are ignored below)
            var typesWithTimestamps = new HashSet<Type> { typeof(User), typeof(Workout), typeof(ExerciseLog) };

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var clrType = entityType.ClrType;
                if (clrType is null || !typeof(BaseEntity).IsAssignableFrom(clrType)) continue;

                if (!typesWithTimestamps.Contains(clrType))
                {
                    modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.CreatedAt));
                    modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.UpdatedAt));
                }
                modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.CreatedBy));
                modelBuilder.Entity(clrType).Ignore(nameof(BaseEntity.UpdatedBy));
            }

            // ── users ────────────────────────────────────────────────────────────
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

            // ── user_profiles ────────────────────────────────────────────────────
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

            // ── goals / user_goals ───────────────────────────────────────────────
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

            // ── allergies / user_allergies ───────────────────────────────────────
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

            // ── password_reset_tokens ────────────────────────────────────────────
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
                entity.HasOne(t => t.User).WithMany().HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(t => t.TokenHash).IsUnique();
                entity.HasIndex(t => t.UserId);
            });

            // ── user_streaks ─────────────────────────────────────────────────────
            modelBuilder.Entity<UserStreak>().HasKey(us => us.UserId);

            // ── exercise_categories ──────────────────────────────────────────────
            modelBuilder.Entity<ExerciseCategory>(entity =>
            {
                entity.ToTable("exercise_categories");
                entity.Property(c => c.Id).HasColumnName("id");
                entity.Property(c => c.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
                entity.Property(c => c.Description).HasColumnName("description");
            });

            // ── files ────────────────────────────────────────────────────────────
            modelBuilder.Entity<FileEntity>(entity =>
            {
                entity.ToTable("files");
                entity.Property(f => f.Id).HasColumnName("id");
                entity.Property(f => f.Entity).HasColumnName("entity");
                entity.Property(f => f.EntityId).HasColumnName("entity_id");
                entity.Property(f => f.Filename).HasColumnName("filename");
                entity.Property(f => f.FilePath).HasColumnName("file_path");
                entity.Property(f => f.FileSize).HasColumnName("file_size");
                entity.Property(f => f.UploadedBy).HasColumnName("uploaded_by");
                // Explicitly bind the Uploader nav to the uploaded_by FK column
                entity.HasOne(f => f.Uploader)
                    .WithMany(u => u.UploadedFiles)
                    .HasForeignKey(f => f.UploadedBy)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ── workout_videos ───────────────────────────────────────────────────
            modelBuilder.Entity<WorkoutVideo>(entity =>
            {
                entity.ToTable("workout_videos");
                entity.Property(v => v.Id).HasColumnName("id");
                entity.Property(v => v.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
                entity.Property(v => v.ExerciseName).HasColumnName("exercise_name").HasMaxLength(120).IsRequired();
                entity.Property(v => v.Description).HasColumnName("description");
                entity.Property(v => v.VideoFileId).HasColumnName("video_file_id");
                entity.Property(v => v.CategoryId).HasColumnName("category_id");
                entity.Property(v => v.DurationSeconds).HasColumnName("duration_seconds");
                entity.Property(v => v.DifficultyLevel).HasColumnName("difficulty_level").HasMaxLength(50);
                entity.Property(v => v.MuscleGroup).HasColumnName("muscle_group").HasMaxLength(100);
                entity.Property(v => v.EstimatedCaloriesBurned).HasColumnName("estimated_calories_burned");
                entity.HasOne(v => v.VideoFile).WithMany().HasForeignKey(v => v.VideoFileId).OnDelete(DeleteBehavior.SetNull);
                entity.HasOne(v => v.Category).WithMany(c => c.WorkoutVideos).HasForeignKey(v => v.CategoryId).OnDelete(DeleteBehavior.SetNull);
            });

            // ── workouts ─────────────────────────────────────────────────────────
            modelBuilder.Entity<Workout>(entity =>
            {
                entity.ToTable("workouts");
                entity.Property(w => w.Id).HasColumnName("id");
                entity.Property(w => w.Title).HasColumnName("title").HasMaxLength(120).IsRequired();
                entity.Property(w => w.Description).HasColumnName("description");
                entity.Property(w => w.CategoryId).HasColumnName("category_id");
                entity.Property(w => w.Difficulty).HasColumnName("difficulty").HasMaxLength(20).IsRequired();
                entity.Property(w => w.MuscleGroup).HasColumnName("muscle_group").HasMaxLength(60);
                entity.Property(w => w.DurationMin).HasColumnName("duration_min");
                entity.Property(w => w.ThumbnailUrl).HasColumnName("thumbnail_url").HasMaxLength(512);
                entity.Property(w => w.PrimaryVideoId).HasColumnName("primary_video_id");
                entity.Property(w => w.IsFeatured).HasColumnName("is_featured");
                entity.Property(w => w.SortOrder).HasColumnName("sort_order");
                entity.Property(w => w.CreatedAt).HasColumnName("created_at");
                entity.Property(w => w.UpdatedAt).HasColumnName("updated_at");
                entity.HasOne(w => w.Category).WithMany(c => c.Workouts).HasForeignKey(w => w.CategoryId).OnDelete(DeleteBehavior.SetNull);
                entity.HasOne(w => w.PrimaryVideo).WithMany().HasForeignKey(w => w.PrimaryVideoId).OnDelete(DeleteBehavior.SetNull);
            });

            // ── user_workout_progress ────────────────────────────────────────────
            modelBuilder.Entity<UserWorkoutProgress>(entity =>
            {
                entity.ToTable("user_workout_progress");
                entity.Property(p => p.Id).HasColumnName("id");
                entity.Property(p => p.UserId).HasColumnName("user_id");
                entity.Property(p => p.WorkoutId).HasColumnName("workout_id");
                entity.Property(p => p.ProgressPct).HasColumnName("progress_pct");
                entity.Property(p => p.LastWatchedAt).HasColumnName("last_watched_at");
                entity.Property(p => p.CompletedAt).HasColumnName("completed_at");
                entity.HasIndex(p => new { p.UserId, p.WorkoutId }).IsUnique();
                entity.HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(p => p.Workout).WithMany(w => w.UserProgress).HasForeignKey(p => p.WorkoutId).OnDelete(DeleteBehavior.Cascade);
            });

            // ── user_workout_favorites ───────────────────────────────────────────
            modelBuilder.Entity<UserWorkoutFavorite>(entity =>
            {
                entity.ToTable("user_workout_favorites");
                entity.HasKey(f => new { f.UserId, f.WorkoutId });
                entity.Property(f => f.UserId).HasColumnName("user_id");
                entity.Property(f => f.WorkoutId).HasColumnName("workout_id");
                entity.Property(f => f.CreatedAt).HasColumnName("created_at");
                entity.HasOne(f => f.User).WithMany().HasForeignKey(f => f.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(f => f.Workout).WithMany(w => w.Favorites).HasForeignKey(f => f.WorkoutId).OnDelete(DeleteBehavior.Cascade);
            });

            // ── recipes / recipe_allergens ───────────────────────────────────────
            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.ToTable("recipes");
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Id).HasColumnName("id");
                entity.Property(r => r.Title).HasColumnName("title").HasMaxLength(200).IsRequired();
                entity.Property(r => r.Description).HasColumnName("description").HasMaxLength(1000);
                entity.Property(r => r.Instructions).HasColumnName("instructions");
                entity.Property(r => r.Calories).HasColumnName("calories");
                entity.Property(r => r.ProteinG).HasColumnName("protein_g").HasColumnType("decimal(6,2)");
                entity.Property(r => r.CarbsG).HasColumnName("carbs_g").HasColumnType("decimal(6,2)");
                entity.Property(r => r.FatG).HasColumnName("fat_g").HasColumnType("decimal(6,2)");
                entity.Property(r => r.PrepTimeMin).HasColumnName("prep_time_min");
                entity.Property(r => r.CookTimeMin).HasColumnName("cook_time_min");
                entity.Property(r => r.ServingsCount).HasColumnName("servings_count");
                entity.Property(r => r.DietType).HasColumnName("diet_type").HasMaxLength(50);
                entity.Property(r => r.Category).HasColumnName("category").HasMaxLength(100);
                entity.Property(r => r.ImageUrl).HasColumnName("image_url").HasMaxLength(512);
                entity.Property(r => r.IsFeatured).HasColumnName("is_featured");
                entity.Property(r => r.SortOrder).HasColumnName("sort_order");
                entity.Property(r => r.ImageFileId).HasColumnName("image_file_id");
                entity.Property(r => r.DifficultyLevel).HasColumnName("difficulty_level").HasMaxLength(20);
                entity.Property(r => r.IngredientsJson).HasColumnName("ingredients_json").HasColumnType("text");
                entity.Property(r => r.StepsJson).HasColumnName("steps_json").HasColumnType("text");

                entity.HasOne(r => r.ImageFile)
                    .WithMany()
                    .HasForeignKey(r => r.ImageFileId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(r => r.Category).HasDatabaseName("IX_recipes_category");
                entity.HasIndex(r => r.DietType).HasDatabaseName("IX_recipes_diet_type");
                entity.HasIndex(r => r.SortOrder).HasDatabaseName("IX_recipes_sort_order");
            });

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

                entity.HasIndex(ra => ra.RecipeId).HasDatabaseName("IX_recipe_allergens_recipe_id");
                entity.HasIndex(ra => ra.AllergyId).HasDatabaseName("IX_recipe_allergens_allergy_id");
                entity.HasIndex(ra => new { ra.RecipeId, ra.AllergyId })
                    .IsUnique()
                    .HasDatabaseName("UX_recipe_allergens_recipe_allergy");
            });

            // ── exercise_logs ────────────────────────────────────────────────────
            modelBuilder.Entity<ExerciseLog>(entity =>
            {
                entity.ToTable("exercise_logs");
                entity.HasKey(l => l.Id);
                entity.Property(l => l.Id).HasColumnName("id");
                entity.Property(l => l.UserId).HasColumnName("user_id");
                entity.Property(l => l.ExerciseId).HasColumnName("exercise_id");
                entity.Property(l => l.ExerciseName)
                    .HasColumnName("exercise_name")
                    .HasMaxLength(200)
                    .IsRequired();
                entity.Property(l => l.BodyPart).HasColumnName("body_part").HasMaxLength(100);
                entity.Property(l => l.WorkoutId).HasColumnName("workout_id");
                entity.Property(l => l.CaloriesBurned).HasColumnName("calories_burned");
                entity.Property(l => l.DurationSeconds).HasColumnName("duration_seconds");
                entity.Property(l => l.CompletedAt).HasColumnName("completed_at");
                entity.Property(l => l.Notes).HasColumnName("notes").HasMaxLength(500);
                entity.Property(l => l.CreatedAt).HasColumnName("created_at");
                entity.Property(l => l.UpdatedAt).HasColumnName("updated_at");

                entity.HasOne(l => l.User)
                    .WithMany(u => u.ExerciseLogs)
                    .HasForeignKey(l => l.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(l => l.Exercise)
                    .WithMany(v => v.ExerciseLogs)
                    .HasForeignKey(l => l.ExerciseId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(l => l.Workout)
                    .WithMany(w => w.ExerciseLogs)
                    .HasForeignKey(l => l.WorkoutId)
                    .OnDelete(DeleteBehavior.SetNull);

                // Optimised for user-history and per-body-part analytics queries
                entity.HasIndex(l => new { l.UserId, l.CompletedAt })
                    .HasDatabaseName("IX_exercise_logs_user_completed");
                entity.HasIndex(l => new { l.UserId, l.BodyPart })
                    .HasDatabaseName("IX_exercise_logs_user_bodypart");
                entity.HasIndex(l => l.ExerciseId)
                    .HasDatabaseName("IX_exercise_logs_exercise_id");
                entity.HasIndex(l => l.CompletedAt)
                    .HasDatabaseName("IX_exercise_logs_completed_at");
            });
        }
    }
}
