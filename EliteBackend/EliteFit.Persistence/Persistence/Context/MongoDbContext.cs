using EliteFit.Domain.Entities;
using EliteFit.Domain.Entities.Mongo;
using MongoDB.Driver;

namespace EliteFit.Persistence.Persistence.Context
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IMongoClient mongoClient, string databaseName)
        {
            _database = mongoClient.GetDatabase(databaseName);
        }


        public IMongoCollection<Recipe> Recipe => _database.GetCollection<Recipe>("Recipes");
        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        public IMongoCollection<UserProfile> UserProfiles => _database.GetCollection<UserProfile>("UserProfiles");
        public IMongoCollection<Allergy> Allergies => _database.GetCollection<Allergy>("Allergies");
        public IMongoCollection<Badge> Badges => _database.GetCollection<Badge>("Badges");
        public IMongoCollection<ExerciseCategory> ExerciseCategories => _database.GetCollection<ExerciseCategory>("ExerciseCategories");
        public IMongoCollection<FileEntity> Files => _database.GetCollection<FileEntity>("Files");
        public IMongoCollection<Goal> Goals => _database.GetCollection<Goal>("Goals");
        public IMongoCollection<Notification> Notifications => _database.GetCollection<Notification>("Notifications");
        public IMongoCollection<WorkoutVideo> WorkoutVideos => _database.GetCollection<WorkoutVideo>("WorkoutVideos");
        public IMongoCollection<UserStreak> UserStreaks => _database.GetCollection<UserStreak>("UserStreaks");
        public IMongoCollection<Role> Roles => _database.GetCollection<Role>("Roles");
        public IMongoCollection<AuditLog> AuditLogs => _database.GetCollection<AuditLog>("AuditLogs");
        public IMongoCollection<Permission> Permissions => _database.GetCollection<Permission>("Permissions");
        public IMongoCollection<Setting> Settings => _database.GetCollection<Setting>("Settings");
        public IMongoCollection<QuickFixTip> QuickFixTips => _database.GetCollection<QuickFixTip>("QuickFixTips");

        // ==========================================
        // KOLEKSIONET NDËRMJETËSE (Join Collections / Many-to-Many)
        // ==========================================
        public IMongoCollection<UserAllergy> UserAllergies => _database.GetCollection<UserAllergy>("UserAllergies");
        public IMongoCollection<RecipeAllergenInfo> RecipeAllergens => _database.GetCollection<RecipeAllergenInfo>("RecipeAllergens");
        public IMongoCollection<UserRole> UserRoles => _database.GetCollection<UserRole>("UserRoles");
        public IMongoCollection<RolePermission> RolePermissions => _database.GetCollection<RolePermission>("RolePermissions");
        public IMongoCollection<UserBadge> UserBadges => _database.GetCollection<UserBadge>("UserBadges");
        public IMongoCollection<UserGoal> UserGoals => _database.GetCollection<UserGoal>("UserGoals");
        public IMongoCollection<UserWorkoutHistory> UserWorkoutHistories => _database.GetCollection<UserWorkoutHistory>("UserWorkoutHistories");
    }
}