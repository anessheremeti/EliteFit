using EliteFit.Domain.Entities.Mongo;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IAuditLogRepository
    {
        Task AddLogAsync(AuditLog log);
        Task<IEnumerable<AuditLog>> GetAllAsync(CancellationToken ct = default);
        Task<IEnumerable<AuditLog>> GetFilteredAsync(
            int? userId,
            string? entity,
            string? action,
            DateTime? from,
            DateTime? to,
            int page,
            int pageSize,
            CancellationToken ct = default);
        Task<long> CountFilteredAsync(int? userId, string? entity, string? action, DateTime? from, DateTime? to, CancellationToken ct = default);
        Task<IEnumerable<AuditLog>> GetLogsByUserIdAsync(int userId);
    }
}
