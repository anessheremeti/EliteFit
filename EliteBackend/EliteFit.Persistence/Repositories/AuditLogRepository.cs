using EliteFit.Domain.Entities.Mongo;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class AuditLogRepository(ApplicationDbContext context) : IAuditLogRepository
    {
        public async Task AddLogAsync(AuditLog log)
        {
            context.AuditLogs.Add(log);
            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetAllAsync(CancellationToken ct = default)
            => await context.AuditLogs
                .AsNoTracking()
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync(ct);

        public async Task<IEnumerable<AuditLog>> GetFilteredAsync(
            int?      userId,
            string?   entity,
            string?   action,
            DateTime? from,
            DateTime? to,
            int       page,
            int       pageSize,
            CancellationToken ct = default)
            => await BuildQuery(userId, entity, action, from, to)
                .OrderByDescending(l => l.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);

        public async Task<long> CountFilteredAsync(
            int?      userId,
            string?   entity,
            string?   action,
            DateTime? from,
            DateTime? to,
            CancellationToken ct = default)
            => await BuildQuery(userId, entity, action, from, to).LongCountAsync(ct);

        public async Task<IEnumerable<AuditLog>> GetLogsByUserIdAsync(int userId)
            => await context.AuditLogs
                .AsNoTracking()
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

        // ── helpers ────────────────────────────────────────────────────────────

        private IQueryable<AuditLog> BuildQuery(
            int? userId, string? entity, string? action, DateTime? from, DateTime? to)
        {
            var q = context.AuditLogs.AsNoTracking();

            if (userId.HasValue)
                q = q.Where(l => l.UserId == userId.Value);

            if (!string.IsNullOrWhiteSpace(entity))
                q = q.Where(l => l.Entity != null && l.Entity.Contains(entity));

            if (!string.IsNullOrWhiteSpace(action))
                q = q.Where(l => l.Action != null && l.Action.Contains(action));

            if (from.HasValue)
                q = q.Where(l => l.CreatedAt >= from.Value);

            if (to.HasValue)
                q = q.Where(l => l.CreatedAt <= to.Value);

            return q;
        }
    }
}
