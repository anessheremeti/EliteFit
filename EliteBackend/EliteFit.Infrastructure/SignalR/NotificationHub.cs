using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace EliteFit.Infrastructure.SignalR
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            // Merr ID-në e përdoruesit nga Claims të JWT Token
            var userId = Context.UserIdentifier;

            // Opsionale: Mund ta mbash për loggim që të shohësh në konsolë kush u lidh
            Console.WriteLine($"[SignalR Connection] Përdoruesi me ID: {userId} u lidh me sukses. ConnectionId: {Context.ConnectionId}");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            Console.WriteLine($"[SignalR Disconnection] Përdoruesi me ID: {userId} u shkëput.");

            await base.OnDisconnectedAsync(exception);
        }
    }
}