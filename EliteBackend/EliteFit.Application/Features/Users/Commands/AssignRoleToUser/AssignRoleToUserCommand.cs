using MediatR;

namespace EliteFit.Application.Features.Users.Commands.AssignRoleToUser
{
    public record AssignRoleToUserCommand(int UserId, int RoleId) : IRequest<bool>;
}
