using EliteFit.Domain.Entities;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EliteFit.Persistence.Services
{
    public class BadgeSeedService
    {
        private readonly ApplicationDbContext _ctx;
        private readonly ILogger<BadgeSeedService> _log;

        public BadgeSeedService(ApplicationDbContext ctx, ILogger<BadgeSeedService> log)
        {
            _ctx = ctx;
            _log = log;
        }

        public async Task SeedAsync()
        {
            await EnsureSchemaAsync();
            await SeedBadgeCatalogAsync();
            await AwardInitialBadgesAsync();
        }

        // ── 1. Schema ─────────────────────────────────────────────────────────────

        private async Task EnsureSchemaAsync()
        {
            var conn = _ctx.Database.GetDbConnection();
            await conn.OpenAsync();
            await using var cmd = conn.CreateCommand();

            // Ensure badges table exists with full schema
            cmd.CommandText = @"
                CREATE TABLE IF NOT EXISTS badges (
                    id              INT NOT NULL AUTO_INCREMENT,
                    name            VARCHAR(100) NOT NULL,
                    description     VARCHAR(500),
                    category        VARCHAR(50)  NOT NULL DEFAULT 'Milestone',
                    trigger_type    VARCHAR(50)  NOT NULL DEFAULT 'Manual',
                    trigger_threshold INT         NOT NULL DEFAULT 1,
                    tier            VARCHAR(20)  NOT NULL DEFAULT 'Bronze',
                    points          INT          NOT NULL DEFAULT 0,
                    icon_emoji      VARCHAR(20),
                    color           VARCHAR(7),
                    is_secret       TINYINT(1)   NOT NULL DEFAULT 0,
                    is_active       TINYINT(1)   NOT NULL DEFAULT 1,
                    sort_order      INT          NOT NULL DEFAULT 0,
                    badge_icon_id   INT,
                    PRIMARY KEY (id),
                    KEY IX_badges_category  (category),
                    KEY IX_badges_is_active (is_active),
                    KEY IX_badges_sort_order(sort_order)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
            await cmd.ExecuteNonQueryAsync();

            // Add any columns that might be missing from an older badges table
            await AddColumnIfMissingAsync(cmd, "badges", "category",          "VARCHAR(50) NOT NULL DEFAULT 'Milestone'");
            await AddColumnIfMissingAsync(cmd, "badges", "trigger_type",      "VARCHAR(50) NOT NULL DEFAULT 'Manual'");
            await AddColumnIfMissingAsync(cmd, "badges", "trigger_threshold", "INT NOT NULL DEFAULT 1");
            await AddColumnIfMissingAsync(cmd, "badges", "tier",              "VARCHAR(20) NOT NULL DEFAULT 'Bronze'");
            await AddColumnIfMissingAsync(cmd, "badges", "points",            "INT NOT NULL DEFAULT 0");
            await AddColumnIfMissingAsync(cmd, "badges", "icon_emoji",        "VARCHAR(20)");
            await AddColumnIfMissingAsync(cmd, "badges", "color",             "VARCHAR(7)");
            await AddColumnIfMissingAsync(cmd, "badges", "is_secret",         "TINYINT(1) NOT NULL DEFAULT 0");
            await AddColumnIfMissingAsync(cmd, "badges", "is_active",         "TINYINT(1) NOT NULL DEFAULT 1");
            await AddColumnIfMissingAsync(cmd, "badges", "sort_order",        "INT NOT NULL DEFAULT 0");

            // Ensure user_badges table exists with full schema
            cmd.CommandText = @"
                CREATE TABLE IF NOT EXISTS user_badges (
                    id             INT NOT NULL AUTO_INCREMENT,
                    user_id        INT NOT NULL,
                    badge_id       INT NOT NULL,
                    earned_at      DATETIME,
                    progress_count INT NOT NULL DEFAULT 0,
                    PRIMARY KEY (id),
                    UNIQUE KEY UX_user_badges_user_badge (user_id, badge_id),
                    KEY IX_user_badges_user_id (user_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
            await cmd.ExecuteNonQueryAsync();

            await AddColumnIfMissingAsync(cmd, "user_badges", "progress_count", "INT NOT NULL DEFAULT 0");

            await conn.CloseAsync();
            _log.LogInformation("Badge schema verified.");
        }

        private static async Task AddColumnIfMissingAsync(
            System.Data.Common.DbCommand cmd, string table, string column, string definition)
        {
            // Use information_schema to check existence before ALTER TABLE
            cmd.CommandText = $@"
                SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME   = '{table}'
                  AND COLUMN_NAME  = '{column}';";

            var count = Convert.ToInt64(await cmd.ExecuteScalarAsync());
            if (count == 0)
            {
                cmd.CommandText = $"ALTER TABLE `{table}` ADD COLUMN `{column}` {definition};";
                await cmd.ExecuteNonQueryAsync();
            }
        }

        // ── 2. Badge catalog ──────────────────────────────────────────────────────

        private async Task SeedBadgeCatalogAsync()
        {
            var existing = await _ctx.Badges.Select(b => b.Name).ToListAsync();
            var toInsert = GetBadgeSeedData()
                .Where(b => !existing.Contains(b.Name))
                .ToList();

            if (toInsert.Count == 0) return;

            _ctx.Badges.AddRange(toInsert);
            await _ctx.SaveChangesAsync();
            _log.LogInformation("Seeded {Count} badge(s).", toInsert.Count);
        }

        private static IEnumerable<Badge> GetBadgeSeedData() =>
        [
            // ── Workout ────────────────────────────────────────────────────────────
            new Badge { Name = "First Rep",     Description = "Complete your very first workout.",          Category = "Workout",   TriggerType = "WorkoutsCompleted", TriggerThreshold = 1,   Tier = "Bronze",   Points = 10,   IconEmoji = "🏋️",  Color = "#3B82F6", SortOrder = 10 },
            new Badge { Name = "Warm Up",       Description = "Complete 5 workouts. You're getting into it!", Category = "Workout", TriggerType = "WorkoutsCompleted", TriggerThreshold = 5,   Tier = "Bronze",   Points = 25,   IconEmoji = "💪",  Color = "#3B82F6", SortOrder = 11 },
            new Badge { Name = "Committed",     Description = "Complete 25 workouts. The habit is forming.", Category = "Workout",  TriggerType = "WorkoutsCompleted", TriggerThreshold = 25,  Tier = "Silver",   Points = 100,  IconEmoji = "🎯",  Color = "#3B82F6", SortOrder = 12 },
            new Badge { Name = "Iron Will",     Description = "Complete 100 workouts. True dedication.",    Category = "Workout",   TriggerType = "WorkoutsCompleted", TriggerThreshold = 100, Tier = "Gold",     Points = 500,  IconEmoji = "⚡",  Color = "#3B82F6", SortOrder = 13 },
            new Badge { Name = "Elite Athlete", Description = "Complete 250 workouts. You are elite.",     Category = "Workout",   TriggerType = "WorkoutsCompleted", TriggerThreshold = 250, Tier = "Platinum", Points = 2000, IconEmoji = "🏆",  Color = "#3B82F6", SortOrder = 14 },
            new Badge { Name = "Legendary",     Description = "Only the best reach this level.",           Category = "Workout",   TriggerType = "WorkoutsCompleted", TriggerThreshold = 500, Tier = "Legend",   Points = 5000, IconEmoji = "👑",  Color = "#3B82F6", SortOrder = 15, IsSecret = true },

            // ── Streak ─────────────────────────────────────────────────────────────
            new Badge { Name = "Spark",         Description = "Maintain a 3-day activity streak.",         Category = "Streak",    TriggerType = "StreakDays", TriggerThreshold = 3,   Tier = "Bronze",   Points = 15,   IconEmoji = "🔥",  Color = "#F97316", SortOrder = 20 },
            new Badge { Name = "On Fire",        Description = "Maintain a 7-day activity streak.",        Category = "Streak",    TriggerType = "StreakDays", TriggerThreshold = 7,   Tier = "Silver",   Points = 50,   IconEmoji = "🌟",  Color = "#F97316", SortOrder = 21 },
            new Badge { Name = "Unstoppable",    Description = "Maintain a 30-day activity streak.",       Category = "Streak",    TriggerType = "StreakDays", TriggerThreshold = 30,  Tier = "Gold",     Points = 300,  IconEmoji = "⭐",  Color = "#F97316", SortOrder = 22 },
            new Badge { Name = "Streak Master",  Description = "The streak of legends.",                   Category = "Streak",    TriggerType = "StreakDays", TriggerThreshold = 100, Tier = "Platinum", Points = 1500, IconEmoji = "🌠",  Color = "#F97316", SortOrder = 23, IsSecret = true },

            // ── Calorie ────────────────────────────────────────────────────────────
            new Badge { Name = "First Burn",    Description = "Burn 250 calories through exercise.",       Category = "Calorie",   TriggerType = "CaloriesBurned", TriggerThreshold = 250,   Tier = "Bronze",   Points = 20,   IconEmoji = "🔥",  Color = "#EF4444", SortOrder = 30 },
            new Badge { Name = "Calorie Crusher", Description = "Burn 1,000 total calories.",             Category = "Calorie",   TriggerType = "CaloriesBurned", TriggerThreshold = 1000,  Tier = "Silver",   Points = 80,   IconEmoji = "💥",  Color = "#EF4444", SortOrder = 31 },
            new Badge { Name = "Inferno",       Description = "Burn 5,000 total calories. Unstoppable.",  Category = "Calorie",   TriggerType = "CaloriesBurned", TriggerThreshold = 5000,  Tier = "Gold",     Points = 300,  IconEmoji = "🌋",  Color = "#EF4444", SortOrder = 32 },
            new Badge { Name = "Incinerator",   Description = "You are a machine.",                       Category = "Calorie",   TriggerType = "CaloriesBurned", TriggerThreshold = 25000, Tier = "Platinum", Points = 1500, IconEmoji = "☄️",  Color = "#EF4444", SortOrder = 33, IsSecret = true },

            // ── Nutrition ──────────────────────────────────────────────────────────
            new Badge { Name = "Healthy Start", Description = "Explore the nutrition section and discover your first recipes.", Category = "Nutrition", TriggerType = "Manual", TriggerThreshold = 1, Tier = "Bronze",   Points = 10,  IconEmoji = "🥗",  Color = "#22C55E", SortOrder = 40 },
            new Badge { Name = "Food Explorer", Description = "Build your nutritional arsenal with a variety of recipes.",     Category = "Nutrition", TriggerType = "Manual", TriggerThreshold = 1, Tier = "Silver",   Points = 40,  IconEmoji = "🍱",  Color = "#22C55E", SortOrder = 41 },
            new Badge { Name = "Nutritionist",  Description = "Master the art of clean eating.",                               Category = "Nutrition", TriggerType = "Manual", TriggerThreshold = 1, Tier = "Gold",     Points = 150, IconEmoji = "🥇",  Color = "#22C55E", SortOrder = 42 },

            // ── Milestone ──────────────────────────────────────────────────────────
            new Badge { Name = "Journey Begins", Description = "Complete your profile setup and start your fitness journey.", Category = "Milestone", TriggerType = "ProfileCompleted", TriggerThreshold = 1, Tier = "Bronze", Points = 50,  IconEmoji = "✅",  Color = "#8B5CF6", SortOrder = 50 },
            new Badge { Name = "High Achiever", Description = "Earn 500 total achievement points.",                           Category = "Milestone", TriggerType = "PointsEarned",    TriggerThreshold = 500,  Tier = "Silver", Points = 0,   IconEmoji = "🌟",  Color = "#8B5CF6", SortOrder = 51 },
            new Badge { Name = "Champion",      Description = "The pinnacle of achievement.",                                 Category = "Milestone", TriggerType = "PointsEarned",    TriggerThreshold = 1000, Tier = "Gold",   Points = 0,   IconEmoji = "🏛️",  Color = "#8B5CF6", SortOrder = 52, IsSecret = true },
        ];

        // ── 3. Initial bulk award for existing users ──────────────────────────────

        private async Task AwardInitialBadgesAsync()
        {
            // Only run if no user_badges exist yet (one-time initialization)
            var anyExists = await _ctx.UserBadges.AnyAsync();
            if (anyExists) return;

            // Skip if any metric tables are not yet created (fresh DB / partial migrations)
            var missingTables = await GetMissingMetricTablesAsync();
            if (missingTables.Count > 0)
            {
                _log.LogWarning(
                    "Skipping initial badge awards — metric table(s) not found: {Tables}. " +
                    "Badges will be auto-awarded on first user login.",
                    string.Join(", ", missingTables));
                return;
            }

            var badges  = await _ctx.Badges.AsNoTracking().ToListAsync();
            var userIds = await _ctx.Users.Select(u => u.Id).ToListAsync();
            if (userIds.Count == 0) return;

            foreach (var userId in userIds)
            {
                var metrics = await GetMetricsForUserAsync(userId);
                var toAward = new List<UserBadge>();

                foreach (var badge in badges.Where(b => b.TriggerType != "PointsEarned"))
                {
                    var progress = ComputeRawProgress(badge, metrics);
                    if (progress == 0) continue;

                    var earned = progress >= badge.TriggerThreshold;
                    toAward.Add(new UserBadge
                    {
                        UserId        = userId,
                        BadgeId       = badge.Id,
                        ProgressCount = Math.Min(progress, badge.TriggerThreshold),
                        EarnedAt      = earned ? DateTime.UtcNow : null
                    });
                }

                // PointsEarned pass
                var pointsEarned = badges
                    .Where(b => toAward.Any(t => t.BadgeId == b.Id && t.EarnedAt.HasValue))
                    .Sum(b => b.Points);

                foreach (var badge in badges.Where(b => b.TriggerType == "PointsEarned"))
                {
                    if (pointsEarned >= badge.TriggerThreshold)
                    {
                        toAward.Add(new UserBadge
                        {
                            UserId        = userId,
                            BadgeId       = badge.Id,
                            ProgressCount = badge.TriggerThreshold,
                            EarnedAt      = DateTime.UtcNow
                        });
                    }
                }

                if (toAward.Count > 0)
                    _ctx.UserBadges.AddRange(toAward);
            }

            await _ctx.SaveChangesAsync();
            _log.LogInformation("Initial badge awards computed for {Count} user(s).", userIds.Count);
        }

        private static readonly string[] _metricTables =
            ["userworkoutprogresses", "exerciselogs", "userstreaks", "userprofiles"];

        private async Task<List<string>> GetMissingMetricTablesAsync()
        {
            var conn = _ctx.Database.GetDbConnection();
            await conn.OpenAsync();
            await using var cmd = conn.CreateCommand();

            var missing = new List<string>();
            foreach (var table in _metricTables)
            {
                cmd.CommandText = $@"
                    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
                    WHERE TABLE_SCHEMA = DATABASE()
                      AND TABLE_NAME   = '{table}';";
                var count = Convert.ToInt64(await cmd.ExecuteScalarAsync());
                if (count == 0) missing.Add(table);
            }

            await conn.CloseAsync();
            return missing;
        }

        private async Task<(int WorkoutsCompleted, long CaloriesBurned, int CurrentStreak, bool ProfileCompleted)>
            GetMetricsForUserAsync(int userId)
        {
            var workouts = await _ctx.UserWorkoutProgresses
                .CountAsync(p => p.UserId == userId && p.CompletedAt != null);

            var calories = await _ctx.ExerciseLogs
                .Where(l => l.UserId == userId && l.CaloriesBurned != null)
                .SumAsync(l => (long)(l.CaloriesBurned ?? 0));

            var streak = (await _ctx.UserStreaks
                .Where(s => s.UserId == userId)
                .Select(s => s.CurrentStreak)
                .FirstOrDefaultAsync()) ?? 0;

            var profileDone = (await _ctx.UserProfiles
                .Where(p => p.UserId == userId)
                .Select(p => p.OnboardingCompleted)
                .FirstOrDefaultAsync()) ?? false;

            return (workouts, calories, streak, profileDone);
        }

        private static int ComputeRawProgress(Badge badge,
            (int WorkoutsCompleted, long CaloriesBurned, int CurrentStreak, bool ProfileCompleted) m)
            => badge.TriggerType switch
            {
                "WorkoutsCompleted" => m.WorkoutsCompleted,
                "CaloriesBurned"    => (int)Math.Min(badge.TriggerThreshold, m.CaloriesBurned),
                "StreakDays"        => m.CurrentStreak,
                "ProfileCompleted"  => m.ProfileCompleted ? 1 : 0,
                _                   => 0
            };
    }
}
