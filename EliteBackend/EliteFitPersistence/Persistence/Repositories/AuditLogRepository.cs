using EliteFit.Domain.Entities.Mongo;
using EliteFit.Domain.Interfaces;
using EliteFit.Persistence.Context;
using MongoDB.Driver;

namespace EliteFit.Persistence.Repositories
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly MongoDbContext _context;
        public AuditLogRepository(MongoDbContext context) => _context = context;

        public async Task AddLogAsync(AuditLog log) =>
            await _context.AuditLogs.InsertOneAsync(log);

        public async Task<IEnumerable<AuditLog>> GetLogsByUserIdAsync(int userId) =>
            await _context.AuditLogs.Find(l => l.UserId == userId).ToListAsync();
    }
}