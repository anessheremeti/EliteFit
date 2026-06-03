using EliteFit.Application.DTOs.Admin;
using MediatR;

namespace EliteFit.Application.Features.Roles.Queries.GetRoles
{
    public record GetRolesQuery : IRequest<List<RoleDto>>;
}
