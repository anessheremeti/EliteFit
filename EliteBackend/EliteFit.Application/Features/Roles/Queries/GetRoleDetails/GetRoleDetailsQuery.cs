using EliteFit.Application.DTOs.Admin;
using MediatR;

namespace EliteFit.Application.Features.Roles.Queries.GetRoleDetails
{
    public record GetRoleDetailsQuery(int RoleId) : IRequest<RoleDetailsDto?>;
}
