using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public record BadgeUserMetrics(
        int WorkoutsCompleted,
        long CaloriesBurned,
        int CurrentStreak,
        bool ProfileCompleted
    );

    public interface IBadgeRepository
    {
        Task<IEnumerable<Badge>> GetAllActiveAsync();
        Task<IEnumerable<UserBadge>> GetUserBadgesAsync(int userId);
        Task<BadgeUserMetrics> GetUserMetricsAsync(int userId);
        Task UpsertUserBadgesAsync(int userId, IEnumerable<(int BadgeId, int ProgressCount, bool Earned)> updates);
        Task SaveChangesAsync();
    }
}
