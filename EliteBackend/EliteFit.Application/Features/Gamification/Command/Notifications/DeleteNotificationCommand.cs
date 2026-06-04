using MediatR;

namespace EliteFit.Application.Features.Gamification.Command.Notifications
{
    public record DeleteNotificationCommand(int NotificationId, int UserId) : IRequest<bool>;
}
