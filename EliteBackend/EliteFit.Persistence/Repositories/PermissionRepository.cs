using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class PermissionRepository(ApplicationDbContext context) : IPermissionRepository
    {
        public async Task<List<Permission>> GetAllAsync(CancellationToken ct = default)
            => await context.Permissions
                .AsNoTracking()
                .OrderBy(p => p.Name)
                .ToListAsync(ct);

        public async Task<Permission?> GetByIdAsync(int id, CancellationToken ct = default)
            => await context.Permissions.FindAsync(new object[] { id }, ct);

        public async Task<Permission?> GetByNameAsync(string name, CancellationToken ct = default)
            => await context.Permissions
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Name == name, ct);
    }
}
