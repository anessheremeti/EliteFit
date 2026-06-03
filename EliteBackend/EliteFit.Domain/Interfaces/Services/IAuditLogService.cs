namespace EliteFit.Domain.Interfaces.Services
{
    public interface IAuditLogService
    {
        Task LogAsync(
            string action,
            string entity,
            int? entityId,
            string? oldValue,
            string? newValue,
            int? userId,
            string? userName,
            string? ipAddress,
            CancellationToken ct = default);
    }
}
