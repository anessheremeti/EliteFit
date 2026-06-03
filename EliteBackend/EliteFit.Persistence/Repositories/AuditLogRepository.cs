using EliteFit.Domain.Entities.Mongo;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using MongoDB.Driver;

namespace EliteFit.Persistence.Repositories
{
    public class AuditLogRepository(MongoDbContext context) : IAuditLogRepository
    {
        private readonly IMongoCollection<AuditLog> _col = context.AuditLogs;

        public async Task AddLogAsync(AuditLog log) =>
            await _col.InsertOneAsync(log);

        public async Task<IEnumerable<AuditLog>> GetAllAsync(CancellationToken ct = default) =>
            await _col.Find(_ => true)
                      .SortByDescending(l => l.CreatedAt)
                      .ToListAsync(ct);

        public async Task<IEnumerable<AuditLog>> GetFilteredAsync(
            int?     userId,
            string?  entity,
            string?  action,
            DateTime? from,
            DateTime? to,
            int      page,
            int      pageSize,
            CancellationToken ct = default)
        {
            var filter = BuildFilter(userId, entity, action, from, to);
            return await _col.Find(filter)
                             .SortByDescending(l => l.CreatedAt)
                             .Skip((page - 1) * pageSize)
                             .Limit(pageSize)
                             .ToListAsync(ct);
        }

        public async Task<long> CountFilteredAsync(
            int?     userId,
            string?  entity,
            string?  action,
            DateTime? from,
            DateTime? to,
            CancellationToken ct = default) =>
            await _col.CountDocumentsAsync(BuildFilter(userId, entity, action, from, to), cancellationToken: ct);

        public async Task<IEnumerable<AuditLog>> GetLogsByUserIdAsync(int userId) =>
            await _col.Find(l => l.UserId == userId)
                      .SortByDescending(l => l.CreatedAt)
                      .ToListAsync();

        // ── helpers ────────────────────────────────────────────────────────────

        private static FilterDefinition<AuditLog> BuildFilter(
            int? userId, string? entity, string? action, DateTime? from, DateTime? to)
        {
            var builder = Builders<AuditLog>.Filter;
            var filters = new List<FilterDefinition<AuditLog>> { builder.Empty };

            if (userId.HasValue)
                filters.Add(builder.Eq(l => l.UserId, userId.Value));

            if (!string.IsNullOrWhiteSpace(entity))
                filters.Add(builder.Regex(l => l.Entity,
                    new MongoDB.Bson.BsonRegularExpression(entity, "i")));

            if (!string.IsNullOrWhiteSpace(action))
                filters.Add(builder.Regex(l => l.Action,
                    new MongoDB.Bson.BsonRegularExpression(action, "i")));

            if (from.HasValue)
                filters.Add(builder.Gte(l => l.CreatedAt, from.Value));

            if (to.HasValue)
                filters.Add(builder.Lte(l => l.CreatedAt, to.Value));

            return builder.And(filters);
        }
    }
}
