using EliteFit.Application.DTOs.Admin;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Users.Queries.GetUsers
{
    public class GetUsersQueryHandler(IUserRepository userRepository)
        : IRequestHandler<GetUsersQuery, List<UserAdminDto>>
    {
        public async Task<List<UserAdminDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            var users = await userRepository.GetAllWithRolesAsync(cancellationToken);

            return users.Select(u => new UserAdminDto
            {
                Id       = u.Id,
                FullName = $"{u.FirstName} {u.LastName}".Trim(),
                Email    = u.Email,
                Roles    = (u.UserRoles ?? []).Select(ur => new UserRoleDto
                {
                    RoleId   = ur.RoleId,
                    RoleName = ur.Role?.Name ?? string.Empty,
                }).ToList(),
                IsActive = u.IsActive,
            }).ToList();
        }
    }
}
