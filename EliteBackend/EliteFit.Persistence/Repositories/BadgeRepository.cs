using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class BadgeRepository : IBadgeRepository
    {
        private readonly ApplicationDbContext _ctx;
        public BadgeRepository(ApplicationDbContext ctx) => _ctx = ctx;

        public async Task<IEnumerable<Badge>> GetAllActiveAsync()
            => await _ctx.Badges
                .Where(b => b.IsActive)
                .OrderBy(b => b.SortOrder)
                .ThenBy(b => b.Id)
                .AsNoTracking()
                .ToListAsync();

        public async Task<IEnumerable<UserBadge>> GetUserBadgesAsync(int userId)
            => await _ctx.UserBadges
                .Where(ub => ub.UserId == userId)
                .AsNoTracking()
                .ToListAsync();

        private static readonly Dictionary<string, string> _metricTableMap = new()
        {
            ["user_workout_progress"] = "workouts",
            ["exercise_logs"]         = "calories",
            ["userstreaks"]           = "streak",
            ["user_profiles"]         = "profile",
        };

        public async Task<BadgeUserMetrics> GetUserMetricsAsync(int userId)
        {
            var present = await GetPresentTablesAsync(_metricTableMap.Keys);

            var workoutsCompleted = present.Contains("user_workout_progress")
                ? await _ctx.UserWorkoutProgresses
                    .CountAsync(p => p.UserId == userId && p.CompletedAt != null)
                : 0;

            var caloriesBurned = present.Contains("exercise_logs")
                ? await _ctx.ExerciseLogs
                    .Where(l => l.UserId == userId && l.CaloriesBurned != null)
                    .SumAsync(l => (long)(l.CaloriesBurned ?? 0))
                : 0L;

            var currentStreak = present.Contains("userstreaks")
                ? (await _ctx.UserStreaks
                    .Where(s => s.UserId == userId)
                    .Select(s => s.CurrentStreak)
                    .FirstOrDefaultAsync()) ?? 0
                : 0;

            var profileCompleted = present.Contains("user_profiles")
                ? (await _ctx.UserProfiles
                    .Where(p => p.UserId == userId)
                    .Select(p => p.OnboardingCompleted)
                    .FirstOrDefaultAsync()) ?? false
                : false;

            return new BadgeUserMetrics(workoutsCompleted, caloriesBurned, currentStreak, profileCompleted);
        }

        private async Task<HashSet<string>> GetPresentTablesAsync(IEnumerable<string> tableNames)
        {
            var conn = _ctx.Database.GetDbConnection();
            await conn.OpenAsync();
            await using var cmd = conn.CreateCommand();
            var found = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var table in tableNames)
            {
                cmd.CommandText = $@"
                    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
                    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '{table}';";
                if (Convert.ToInt64(await cmd.ExecuteScalarAsync()) > 0)
                    found.Add(table);
            }

            await conn.CloseAsync();
            return found;
        }

        public async Task UpsertUserBadgesAsync(int userId, IEnumerable<(int BadgeId, int ProgressCount, bool Earned)> updates)
        {
            var updateList = updates.ToList();
            if (updateList.Count == 0) return;

            var badgeIds = updateList.Select(u => u.BadgeId).ToList();
            var existing = await _ctx.UserBadges
                .Where(ub => ub.UserId == userId && badgeIds.Contains(ub.BadgeId))
                .ToDictionaryAsync(ub => ub.BadgeId);

            foreach (var (badgeId, progressCount, earned) in updateList)
            {
                if (existing.TryGetValue(badgeId, out var ub))
                {
                    ub.ProgressCount = progressCount;
                    if (earned && !ub.EarnedAt.HasValue)
                        ub.EarnedAt = DateTime.UtcNow;
                }
                else
                {
                    _ctx.UserBadges.Add(new UserBadge
                    {
                        UserId = userId,
                        BadgeId = badgeId,
                        ProgressCount = progressCount,
                        EarnedAt = earned ? DateTime.UtcNow : null
                    });
                }
            }
        }

        public Task SaveChangesAsync() => _ctx.SaveChangesAsync();
    }
}
