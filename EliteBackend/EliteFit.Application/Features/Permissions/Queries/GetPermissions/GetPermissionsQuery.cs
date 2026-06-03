using EliteFit.Application.DTOs.Admin;
using MediatR;

namespace EliteFit.Application.Features.Permissions.Queries.GetPermissions
{
    public record GetPermissionsQuery : IRequest<List<PermissionDto>>;
}
