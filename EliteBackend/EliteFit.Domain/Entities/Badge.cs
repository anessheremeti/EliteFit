using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class Badge : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Classification
        public string Category { get; set; } = "Milestone";       // Workout | Streak | Calorie | Nutrition | Milestone
        public string Tier { get; set; } = "Bronze";              // Bronze | Silver | Gold | Platinum | Legend

        // Award trigger
        public string TriggerType { get; set; } = "Manual";       // WorkoutsCompleted | CaloriesBurned | StreakDays | ProfileCompleted | PointsEarned | Manual
        public int TriggerThreshold { get; set; } = 1;            // Value needed to earn the badge

        // Rewards
        public int Points { get; set; }

        // Presentation
        public string? IconEmoji { get; set; }
        public string? Color { get; set; }                        // Hex color for card theming
        public bool IsSecret { get; set; }                        // Hidden until unlocked
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; }

        // Optional uploaded icon (future use)
        public int? BadgeIconId { get; set; }
        public FileEntity? BadgeIcon { get; set; }

        public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
    }
}
