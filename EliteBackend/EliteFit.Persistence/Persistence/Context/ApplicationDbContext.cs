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
            modelBuilder.Entity<UserProfile>().HasKey(up => up.UserId);
            modelBuilder.Entity<UserStreak>().HasKey(us => us.UserId);
        }
    }
}