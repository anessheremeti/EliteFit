using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities.Mongo
{
    public class AuditLog // Mos trashëgo nga BaseEntity nese eshte ne Mongo
    {
       
        public string? Id { get; set; } // MongoDB Id është string (ObjectId)

        public int? UserId { get; set; }
        public string? Action { get; set; }
        public string? Entity { get; set; }
        public int? EntityId { get; set; }

        // Në MongoDB mund t'i bësh këto edhe "Object" nëse dëshiron të ruash JSON të plotë
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }

        public string? IpAddress { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
