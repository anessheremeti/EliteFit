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

        // --- Query Methods ---

        public async Task<User?> GetByEmailAsync(string email)
            => await _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Email == email);

        public async Task<User?> GetByIdAsync(int id)
            => await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        public async Task<User?> GetByIdWithRolesAsync(int id)
            => await _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == id);

        public async Task<bool> EmailExistsAsync(string email)
            => await _context.Users.AnyAsync(u => u.Email == email);

        public async Task<List<User>> GetAllWithRolesAsync(CancellationToken ct = default)
            => await _context.Users
                .AsNoTracking()
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .OrderBy(u => u.Id)
                .ToListAsync(ct);

        public async Task<User?> GetUserWithAllergiesAsync(int id, CancellationToken ct = default)
            => await _context.Users
                .Include(u => u.UserAllergies)
                .FirstOrDefaultAsync(u => u.Id == id, ct);

        // --- Command Methods ---

        public async Task AddAsync(User user)
            => await _context.Users.AddAsync(user);

        public void Update(User user)
            => _context.Users.Update(user); // P�rdoret edhe p�r ndryshim fjal�kalimi (PasswordHash)

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();

        public async Task DeleteAsync(int id, CancellationToken ct = default)
        {
            // Hard Delete: Gjejm� p�rdoruesin me gjith� lidhjet (var�sisht nga Cascade Delete n� DbContext)
            var user = await _context.Users.FindAsync(new object[] { id }, ct);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync(ct);
            }
        }

        public async Task<bool> SetActiveStatusAsync(int id, bool isActive, CancellationToken ct = default)
        {
            var user = await _context.Users.FindAsync(new object[] { id }, ct);
            if (user == null) return false;

            user.IsActive = isActive;
            await _context.SaveChangesAsync(ct);
            return true;
        }

        // --- Role Management ---

        public async Task AssignRoleByNameAsync(int userId, string roleName, CancellationToken ct = default)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName, ct)
                ?? throw new InvalidOperationException($"Role '{roleName}' does not exist.");

            var userExists = await _context.Users.AnyAsync(u => u.Id == userId, ct);
            if (!userExists) throw new InvalidOperationException($"User {userId} does not exist.");

            await AssignRoleAsync(userId, role.Id, ct);
        }

        public async Task<bool> AssignRoleAsync(int userId, int roleId, CancellationToken ct = default)
        {
            var alreadyAssigned = await _context.UserRoles
                .AnyAsync(ur => ur.UserId == userId && ur.RoleId == roleId, ct);

            if (alreadyAssigned) return true;

            await _context.UserRoles.AddAsync(new UserRole
            {
                UserId = userId,
                RoleId = roleId,
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