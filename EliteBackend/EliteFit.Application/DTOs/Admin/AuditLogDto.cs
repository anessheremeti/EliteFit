namespace EliteFit.Application.DTOs.Admin
{
    public record AuditLogDto(
        string  Id,
        int?    UserId,
        string? UserName,
        string? Action,
        string? Entity,
        int?    EntityId,
        string? OldValue,
        string? NewValue,
        string? IpAddress,
        DateTime CreatedAt
    );

    public record AuditLogPagedResultDto(
        IEnumerable<AuditLogDto> Items,
        long   TotalCount,
        int    Page,
        int    PageSize
    );
}
