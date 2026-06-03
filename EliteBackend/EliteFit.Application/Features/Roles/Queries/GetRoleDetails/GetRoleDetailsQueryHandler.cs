using EliteFit.Application.DTOs.Admin;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Roles.Queries.GetRoleDetails
{
    public class GetRoleDetailsQueryHandler(IRoleRepository roleRepository)
        : IRequestHandler<GetRoleDetailsQuery, RoleDetailsDto?>
    {
        public async Task<RoleDetailsDto?> Handle(GetRoleDetailsQuery request, CancellationToken cancellationToken)
        {
            var role = await roleRepository.GetByIdWithPermissionsAsync(request.RoleId, cancellationToken);
            if (role is null) return null;

            return new RoleDetailsDto
            {
                Id          = role.Id,
                Name        = role.Name,
                Description = role.Description,
                Permissions = (role.RolePermissions ?? []).Select(rp => new PermissionDto
                {
                    Id          = rp.Permission!.Id,
                    Name        = rp.Permission.Name,
                    Description = rp.Permission.Description,
                }).ToList(),
            };
        }
    }
}
