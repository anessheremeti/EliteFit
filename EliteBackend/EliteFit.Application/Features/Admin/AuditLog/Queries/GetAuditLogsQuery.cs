using EliteFit.Application.DTOs.Admin;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Admin.AuditLog.Queries
{
    public record GetAuditLogsQuery(
        int?     UserId   = null,
        string?  Entity   = null,
        string?  Action   = null,
        DateTime? From    = null,
        DateTime? To      = null,
        int      Page     = 1,
        int      PageSize = 20
    ) : IRequest<AuditLogPagedResultDto>;

    public class GetAuditLogsQueryHandler(IAuditLogRepository repo)
        : IRequestHandler<GetAuditLogsQuery, AuditLogPagedResultDto>
    {
        public async Task<AuditLogPagedResultDto> Handle(GetAuditLogsQuery q, CancellationToken ct)
        {
            var items = await repo.GetFilteredAsync(
                q.UserId, q.Entity, q.Action, q.From, q.To,
                q.Page, q.PageSize, ct);

            var total = await repo.CountFilteredAsync(
                q.UserId, q.Entity, q.Action, q.From, q.To, ct);

            var dtos = items.Select(l => new AuditLogDto(
                l.Id ?? string.Empty,
                l.UserId,
                l.UserName,
                l.Action,
                l.Entity,
                l.EntityId,
                l.OldValue,
                l.NewValue,
                l.IpAddress,
                l.Endpoint,
                l.HttpMethod,
                l.TraceId,
                l.CreatedAt
            ));

            return new AuditLogPagedResultDto(dtos, total, q.Page, q.PageSize);
        }
    }
}
