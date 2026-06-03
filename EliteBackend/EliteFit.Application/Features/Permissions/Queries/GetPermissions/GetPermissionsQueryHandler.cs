using EliteFit.Application.DTOs.Admin;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Permissions.Queries.GetPermissions
{
    public class GetPermissionsQueryHandler(IPermissionRepository permissionRepository)
        : IRequestHandler<GetPermissionsQuery, List<PermissionDto>>
    {
        public async Task<List<PermissionDto>> Handle(GetPermissionsQuery request, CancellationToken cancellationToken)
        {
            var perms = await permissionRepository.GetAllAsync(cancellationToken);
            return perms.Select(p => new PermissionDto
            {
                Id          = p.Id,
                Name        = p.Name,
                Description = p.Description,
            }).ToList();
        }
    }
}
