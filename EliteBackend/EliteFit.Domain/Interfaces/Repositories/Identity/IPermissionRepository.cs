using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IPermissionRepository
    {
        Task<List<Permission>> GetAllAsync(CancellationToken ct = default);
        Task<Permission?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<Permission?> GetByNameAsync(string name, CancellationToken ct = default);
    }
}
