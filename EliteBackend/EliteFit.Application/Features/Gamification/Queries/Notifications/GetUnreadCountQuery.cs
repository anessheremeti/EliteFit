using MediatR;

namespace EliteFit.Application.Features.Gamification.Queries.Notifications
{
    public record GetUnreadCountQuery(int UserId) : IRequest<int>;
}
