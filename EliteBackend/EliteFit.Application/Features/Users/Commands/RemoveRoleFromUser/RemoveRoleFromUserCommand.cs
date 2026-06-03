using MediatR;

namespace EliteFit.Application.Features.Users.Commands.RemoveRoleFromUser
{
    public record RemoveRoleFromUserCommand(int UserId, int RoleId) : IRequest<bool>;
}
