using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class UserBadge : BaseEntity
    {
        public int UserId { get; set; }
        public int BadgeId { get; set; }
        public DateTime? EarnedAt { get; set; }

        public User? User { get; set; }
        public Badge? Badge { get; set; }
    }
}
