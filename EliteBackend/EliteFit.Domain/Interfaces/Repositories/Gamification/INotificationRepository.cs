using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories.Gamification
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
        Task<int> GetUnreadCountAsync(int userId, CancellationToken cancellationToken);
        Task<bool> MarkAsReadAsync(int notificationId, int userId, CancellationToken cancellationToken);
        Task<int> MarkAllAsReadAsync(int userId, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(int notificationId, int userId, CancellationToken cancellationToken);
    }
}
