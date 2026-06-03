using EliteFit.Application.DTOs.Admin;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Roles.Queries.GetRoles
{
    public class GetRolesQueryHandler(IRoleRepository roleRepository)
        : IRequestHandler<GetRolesQuery, List<RoleDto>>
    {
        public async Task<List<RoleDto>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
        {
            var roles = await roleRepository.GetAllWithPermissionsAsync(cancellationToken);
            return roles.Select(r => new RoleDto
            {
                Id              = r.Id,
                Name            = r.Name,
                Description     = r.Description,
                PermissionCount = r.RolePermissions?.Count ?? 0,
            }).ToList();
        }
    }
}
