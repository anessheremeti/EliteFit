using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IRoleRepository
    {
        Task<List<Role>> GetAllWithPermissionsAsync(CancellationToken ct = default);
        Task<Role?> GetByIdWithPermissionsAsync(int id, CancellationToken ct = default);
        Task<Role?> GetByNameAsync(string name, CancellationToken ct = default);
        Task AddAsync(Role role, CancellationToken ct = default);
        Task<bool> UpdateAsync(int id, string name, string? description, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
        Task<bool> AssignPermissionAsync(int roleId, int permissionId, CancellationToken ct = default);
        Task<bool> RemovePermissionAsync(int roleId, int permissionId, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
