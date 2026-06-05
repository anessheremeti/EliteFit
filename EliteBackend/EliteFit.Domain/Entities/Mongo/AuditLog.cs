using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities.Mongo
{
    public class AuditLog
    {
        public string? Id { get; set; }

        public int?    UserId    { get; set; }
        public string? UserName  { get; set; }

        public string? Action   { get; set; }   // Created | Updated | Deleted
        public string? Entity   { get; set; }   // Recipe | Badge | User | Role …
        public int?    EntityId { get; set; }

        public string? OldValue { get; set; }   // JSON snapshot before change
        public string? NewValue { get; set; }   // JSON snapshot after change

        public string? IpAddress  { get; set; }
        public string? Endpoint   { get; set; } // HTTP path, e.g. /api/admin/recipes/5
        public string? HttpMethod { get; set; } // GET | POST | PUT | PATCH | DELETE
        public string? TraceId    { get; set; } // ASP.NET Core request trace identifier

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
