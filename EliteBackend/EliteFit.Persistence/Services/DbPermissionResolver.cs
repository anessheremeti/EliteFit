using EliteFit.Domain.Interfaces.Services;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Services
{
    public class DbPermissionResolver(ApplicationDbContext context) : IPermissionResolver
    {
        public async Task<HashSet<string>> GetPermissionsForRoleAsync(string roleName, CancellationToken ct = default)
            => (await context.RolePermissions
                .Where(rp => rp.Role!.Name == roleName)
                .Select(rp => rp.Permission!.Name)
                .ToListAsync(ct))
                .ToHashSet();
    }
}
