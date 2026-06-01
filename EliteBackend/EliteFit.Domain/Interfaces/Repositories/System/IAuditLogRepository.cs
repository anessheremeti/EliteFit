using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Domain.Entities.Mongo;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IAuditLogRepository
    {
        Task AddLogAsync(AuditLog log);
        Task<IEnumerable<AuditLog>> GetLogsByUserIdAsync(int userId);
    }
}
