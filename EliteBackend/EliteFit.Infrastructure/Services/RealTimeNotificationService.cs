using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using EliteFit.Infrastructure.SignalR;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.AspNetCore.SignalR;

namespace EliteFit.Infrastructure.Services
{
    public class RealTimeNotificationService : IRealTimeNotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ApplicationDbContext _db;

        public RealTimeNotificationService(
            IHubContext<NotificationHub> hubContext,
            ApplicationDbContext db)
        {
            _hubContext = hubContext;
            _db = db;
        }

        public async Task SendNotificationToUserAsync(int userId, string title, string message, string type = "system")
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = type,
                Title = title,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
            };

            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();

            await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", new
            {
                id = notification.Id,
                type,
                title,
                message,
                isRead = false,
                createdAt = notification.CreatedAt,
            });
        }

        public async Task SendNotificationToAllAsync(string title, string message, string type = "system")
        {
            // Broadcast-only — no persistence (system-wide tips, not per-user records)
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new { type, title, message });
        }
    }
}
