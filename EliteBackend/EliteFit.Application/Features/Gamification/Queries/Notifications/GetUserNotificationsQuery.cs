using EliteFit.Application.DTOs.Gamification;
using MediatR;

namespace EliteFit.Application.Features.Gamification.Queries.Notifications
{
    public record GetUserNotificationsQuery(int UserId) : IRequest<List<NotificationDto>>;
}
