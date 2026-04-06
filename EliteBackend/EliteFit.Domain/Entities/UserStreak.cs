using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class UserStreak
    {
        public int UserId { get; set; }
        public int? CurrentStreak { get; set; } = 0;
        public int? HighestStreak { get; set; } = 0;
        public int? StreakFreezeCount { get; set; } = 0;
        public DateTime? LastActivityDate { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }

        public User? User { get; set; }
    }
}
