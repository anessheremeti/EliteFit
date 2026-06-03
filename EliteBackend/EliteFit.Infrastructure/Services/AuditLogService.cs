using EliteFit.Domain.Entities.Mongo;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Services;

namespace EliteFit.Infrastructure.Services
{
    public class AuditLogService(IAuditLogRepository repo) : IAuditLogService
    {
        public async Task LogAsync(
            string  action,
            string  entity,
            int?    entityId,
            string? oldValue,
            string? newValue,
            int?    userId,
            string? userName,
            string? ipAddress,
            CancellationToken ct = default)
        {
            await repo.AddLogAsync(new AuditLog
            {
                Id        = Guid.NewGuid().ToString("N"),
                Action    = action,
                Entity    = entity,
                EntityId  = entityId,
                OldValue  = oldValue,
                NewValue  = newValue,
                UserId    = userId,
                UserName  = userName,
                IpAddress = ipAddress,
                CreatedAt = DateTime.UtcNow,
            });
        }
    }
}
