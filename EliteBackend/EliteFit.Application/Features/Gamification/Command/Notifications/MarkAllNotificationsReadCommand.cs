using MediatR;

namespace EliteFit.Application.Features.Gamification.Command.Notifications
{
    public record MarkAllNotificationsReadCommand(int UserId) : IRequest<int>;
}
