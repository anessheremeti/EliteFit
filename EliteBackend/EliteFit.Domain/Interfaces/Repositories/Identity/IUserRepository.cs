using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task<bool> EmailExistsAsync(string email);
        Task AddAsync(User user);
        Task SaveChangesAsync();

        Task<List<User>> GetAllWithRolesAsync(CancellationToken ct = default);
        Task<bool> SetActiveStatusAsync(int id, bool isActive, CancellationToken ct = default);
        Task<bool> AssignRoleAsync(int userId, int roleId, CancellationToken ct = default);
        Task AssignRoleByNameAsync(int userId, string roleName, CancellationToken ct = default);
        Task<bool> RemoveRoleAsync(int userId, int roleId, CancellationToken ct = default);
    }
}
