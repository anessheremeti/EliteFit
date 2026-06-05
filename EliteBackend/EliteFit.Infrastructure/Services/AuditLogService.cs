using EliteFit.Domain.Entities.Mongo;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Http;

namespace EliteFit.Infrastructure.Services
{
    public class AuditLogService(
        IAuditLogRepository   repo,
        IHttpContextAccessor  httpContextAccessor) : IAuditLogService
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
            try
            {
                var http = httpContextAccessor.HttpContext;

                await repo.AddLogAsync(new AuditLog
                {
                    Id         = Guid.NewGuid().ToString("N"),
                    Action     = action,
                    Entity     = entity,
                    EntityId   = entityId,
                    OldValue   = oldValue,
                    NewValue   = newValue,
                    UserId     = userId,
                    UserName   = userName,
                    IpAddress  = ipAddress,
                    Endpoint   = http?.Request.Path.Value,
                    HttpMethod = http?.Request.Method,
                    TraceId    = http?.TraceIdentifier,
                    CreatedAt  = DateTime.UtcNow,
                });
            }
            catch (Exception ex)
            {
                // Audit failures must NEVER propagate up and break business operations.
                Console.Error.WriteLine($"[AuditLog] Write failed: {ex.Message}");
            }
        }
    }
}
