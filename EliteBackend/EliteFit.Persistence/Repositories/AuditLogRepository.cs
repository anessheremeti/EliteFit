using EliteFit.Domain.Entities.Mongo;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using MongoDB.Driver;

namespace EliteFit.Persistence.Repositories
{
    // Primary Constructor merr 'context' direkt këtu
    public class AuditLogRepository(MongoDbContext context) : IAuditLogRepository
    {
        private readonly MongoDbContext _context = context;

        public async Task AddLogAsync(AuditLog log) =>
            await _context.AuditLogs.InsertOneAsync(log);

        public async Task<IEnumerable<AuditLog>> GetLogsByUserIdAsync(int userId) =>
            await _context.AuditLogs.Find(l => l.UserId == userId).ToListAsync();
    }
}