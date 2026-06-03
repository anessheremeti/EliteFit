using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Roles.Commands.AssignPermissionToRole
{
    public class AssignPermissionToRoleCommandHandler(IRoleRepository roleRepository)
        : IRequestHandler<AssignPermissionToRoleCommand, bool>
    {
        public async Task<bool> Handle(AssignPermissionToRoleCommand request, CancellationToken cancellationToken)
            => await roleRepository.AssignPermissionAsync(request.RoleId, request.PermissionId, cancellationToken);
    }
}
