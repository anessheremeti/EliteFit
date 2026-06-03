using EliteFit.Application.DTOs.Admin;
using MediatR;

namespace EliteFit.Application.Features.Users.Queries.GetUsers
{
    public record GetUsersQuery : IRequest<List<UserAdminDto>>;
}
