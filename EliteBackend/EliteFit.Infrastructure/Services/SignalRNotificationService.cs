using Microsoft.AspNetCore.SignalR;
using EliteFit.Domain.Interfaces.Services;
using EliteFit.Infrastructure.SignalR;
using EliteFit.Domain.Entities;
using EliteFit.Persistence.Persistence.Context; // Sigurohu që ke namespace-in e Notification entitetit
// using EliteFit.Infrastructure.Data; // Ndryshoje sipas namespace të DbContext-it tënd

namespace EliteFit.Infrastructure.Services;

public class SignalRNotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ApplicationDbContext _context; // 1. Shto DbContext-in këtu

    public SignalRNotificationService(
        IHubContext<NotificationHub> hubContext,
        ApplicationDbContext context) // 2. Injektoje në konstruktor
    {
        _hubContext = hubContext;
        _context = context;
    }

    public async Task SendNotificationAsync(int userId, string title, string message)
    {
        // 3. KRIJO DHE RUAJ NJOFTIMIN NË DATABAZË ME ID-NË E SAKTË (userId)
        var dbNotification = new Notification
        {
            UserId = userId, // Tani do të jetë dinamike (3 për Lendritin)
            Type = "system",
            Title = title,
            Message = message,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(dbNotification);
        await _context.SaveChangesAsync(); // Ruhet në SQL!

        // 4. DËRGO NJOFTIMIN REAL-TIME (Tani mund të dërgosh objektin e plotë me ID nga DB)
        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", new
        {
            Id = dbNotification.Id, // I rëndësishëm për front-end kur ta bëjë "mark as read"
            Title = title,
            Message = message,
            IsRead = false,
            CreatedAt = dbNotification.CreatedAt
        });
    }
}