using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
            => await _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Email == email);

        public async Task<User?> GetByIdAsync(int id)
            => await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        public async Task<bool> EmailExistsAsync(string email)
            => await _context.Users.AnyAsync(u => u.Email == email);

        public async Task AddAsync(User user)
            => await _context.Users.AddAsync(user);

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();

        public async Task<List<User>> GetAllWithRolesAsync(CancellationToken ct = default)
            => await _context.Users
                .AsNoTracking()
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .OrderBy(u => u.Id)
                .ToListAsync(ct);

        public async Task<bool> SetActiveStatusAsync(int id, bool isActive, CancellationToken ct = default)
        {
            var user = await _context.Users.FindAsync(new object[] { id }, ct);
            if (user == null) return false;
            user.IsActive = isActive;
            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task AssignRoleByNameAsync(int userId, string roleName, CancellationToken ct = default)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName, ct)
                ?? throw new InvalidOperationException($"Role '{roleName}' does not exist.");

            var user = await _context.Users.AnyAsync(u => u.Id == userId, ct);
            if (!user)
                throw new InvalidOperationException($"User {userId} does not exist.");

            await AssignRoleAsync(userId, role.Id, ct);
        }

        public async Task<bool> AssignRoleAsync(int userId, int roleId, CancellationToken ct = default)
        {
            var user = await _context.Users.FindAsync(new object[] { userId }, ct);
            if (user is null) return false;

            var alreadyAssigned = await _context.UserRoles
                .AnyAsync(ur => ur.UserId == userId && ur.RoleId == roleId, ct);
            if (alreadyAssigned) return true;

            await _context.UserRoles.AddAsync(new Domain.Entities.UserRole
            {
                UserId     = userId,
                RoleId     = roleId,
                AssignedAt = DateTime.UtcNow,
            }, ct);
            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> RemoveRoleAsync(int userId, int roleId, CancellationToken ct = default)
        {
            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId, ct);
            if (userRole is null) return false;
            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}
