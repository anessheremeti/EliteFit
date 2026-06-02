using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Gamification
{
    public class UserBadgeDto
    {
        public int Id { get; set; }
        public int BadgeId { get; set; }
        public string BadgeName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconPath { get; set; }
        public DateTime? EarnedAt { get; set; }
    }
}
