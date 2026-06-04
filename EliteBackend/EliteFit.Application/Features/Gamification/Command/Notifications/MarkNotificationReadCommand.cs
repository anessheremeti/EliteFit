using MediatR;

namespace EliteFit.Application.Features.Gamification.Command.Notifications
{
    public record MarkNotificationReadCommand(int NotificationId, int UserId) : IRequest<bool>;
}
