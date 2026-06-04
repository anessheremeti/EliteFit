using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories.Gamification.Command
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDbContext _context;

        public NotificationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Notification>> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<int> GetUnreadCountAsync(int userId, CancellationToken cancellationToken)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead, cancellationToken);
        }

        public async Task<bool> MarkAsReadAsync(int notificationId, int userId, CancellationToken cancellationToken)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId, cancellationToken);

            if (notification is null) return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<int> MarkAllAsReadAsync(int userId, CancellationToken cancellationToken)
        {
            var unread = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync(cancellationToken);

            foreach (var n in unread) n.IsRead = true;
            await _context.SaveChangesAsync(cancellationToken);
            return unread.Count;
        }

        public async Task<bool> DeleteAsync(int notificationId, int userId, CancellationToken cancellationToken)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId, cancellationToken);

            if (notification is null) return false;

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
