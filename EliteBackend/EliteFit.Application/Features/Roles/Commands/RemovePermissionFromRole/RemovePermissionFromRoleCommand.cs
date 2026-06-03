using MediatR;

namespace EliteFit.Application.Features.Roles.Commands.RemovePermissionFromRole
{
    public record RemovePermissionFromRoleCommand(int RoleId, int PermissionId) : IRequest<bool>;
}
