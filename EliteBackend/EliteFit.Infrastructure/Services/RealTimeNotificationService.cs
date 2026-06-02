using System;
using System.Threading.Tasks;
// 1. Këto librari funksionojnë pa error vetëm në projekte që shohin shtresën Web/Infrastructure
using Microsoft.AspNetCore.SignalR;
// 2. Thërrasim ndërfaqen nga Domain duke përdorur rrugën e saktë që ke shkruar ti
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;

namespace EliteFit.Infrastructure.Services // Ndryshoje namespace-in sipas projektit ku e vendos
{
    public class RealTimeNotificationService : IRealTimeNotificationService
    {
        // Përdorim rrugën e plotë për Hub-in që të mos ketë ngatërresa
        private readonly IHubContext<EliteFit.Infrastructure.SignalR.NotificationHub> _hubContext;

        public RealTimeNotificationService(IHubContext<EliteFit.Infrastructure.SignalR.NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendNotificationToUserAsync(int userId, string title, string message)
        {
            await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", title, message);
        }

        public async Task SendNotificationToAllAsync(string title, string message)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", title, message);
        }
    }
}