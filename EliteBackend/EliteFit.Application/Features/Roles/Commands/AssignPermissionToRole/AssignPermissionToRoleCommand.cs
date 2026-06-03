using MediatR;

namespace EliteFit.Application.Features.Roles.Commands.AssignPermissionToRole
{
    public record AssignPermissionToRoleCommand(int RoleId, int PermissionId) : IRequest<bool>;
}
