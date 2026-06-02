using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Gamification
{
    public class UserStreakDto
    {
        public int UserId { get; set; }
        public int CurrentStreak { get; set; }
        public int HighestStreak { get; set; }
        public int StreakFreezeCount { get; set; }
        public DateTime? LastActivityDate { get; set; }
    }
}
