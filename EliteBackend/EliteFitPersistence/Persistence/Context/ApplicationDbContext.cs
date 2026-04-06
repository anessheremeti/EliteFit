using System.Collections.Generic;
using System.Reflection.Emit;
using EliteFit.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

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

            // Këtu do të vendosim konfigurimet për Primary Keys që nuk janë "Id"
            modelBuilder.Entity<UserProfile>().HasKey(up => up.UserId);
            modelBuilder.Entity<UserStreak>().HasKey(us => us.UserId);
        }
    }
}