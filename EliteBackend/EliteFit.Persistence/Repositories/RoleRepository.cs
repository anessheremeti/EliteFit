using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class RoleRepository(ApplicationDbContext context) : IRoleRepository
    {
        public async Task<List<Role>> GetAllWithPermissionsAsync(CancellationToken ct = default)
            => await context.Roles
                .AsNoTracking()
                .Include(r => r.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
                .OrderBy(r => r.Id)
                .ToListAsync(ct);

        public async Task<Role?> GetByIdWithPermissionsAsync(int id, CancellationToken ct = default)
            => await context.Roles
                .Include(r => r.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
                .FirstOrDefaultAsync(r => r.Id == id, ct);

        public async Task<Role?> GetByNameAsync(string name, CancellationToken ct = default)
            => await context.Roles
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Name == name, ct);

        public async Task AddAsync(Role role, CancellationToken ct = default)
            => await context.Roles.AddAsync(role, ct);

        public async Task<bool> UpdateAsync(int id, string name, string? description, CancellationToken ct = default)
        {
            var role = await context.Roles.FindAsync(new object[] { id }, ct);
            if (role is null) return false;
            role.Name        = name;
            role.Description = description;
            await context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var role = await context.Roles.FindAsync(new object[] { id }, ct);
            if (role is null) return false;
            context.Roles.Remove(role);
            await context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> AssignPermissionAsync(int roleId, int permissionId, CancellationToken ct = default)
        {
            var exists = await context.RolePermissions
                .AnyAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId, ct);
            if (exists) return true;

            var role       = await context.Roles.FindAsync(new object[] { roleId }, ct);
            var permission = await context.Permissions.FindAsync(new object[] { permissionId }, ct);
            if (role is null || permission is null) return false;

            context.RolePermissions.Add(new RolePermission
            {
                RoleId       = roleId,
                PermissionId = permissionId,
            });
            await context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> RemovePermissionAsync(int roleId, int permissionId, CancellationToken ct = default)
        {
            var rp = await context.RolePermissions
                .FirstOrDefaultAsync(x => x.RoleId == roleId && x.PermissionId == permissionId, ct);
            if (rp is null) return false;
            context.RolePermissions.Remove(rp);
            await context.SaveChangesAsync(ct);
            return true;
        }

        public async Task SaveChangesAsync(CancellationToken ct = default)
            => await context.SaveChangesAsync(ct);
    }
}
