using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Roles.Commands.RemovePermissionFromRole
{
    public class RemovePermissionFromRoleCommandHandler(IRoleRepository roleRepository)
        : IRequestHandler<RemovePermissionFromRoleCommand, bool>
    {
        public async Task<bool> Handle(RemovePermissionFromRoleCommand request, CancellationToken cancellationToken)
            => await roleRepository.RemovePermissionAsync(request.RoleId, request.PermissionId, cancellationToken);
    }
}
