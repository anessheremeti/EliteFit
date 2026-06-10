using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Workouts
{
    public class WorkoutCompletionResultDto
    {
        public int CaloriesBurned { get; set; }
        public int CurrentStreak { get; set; }
        public List<BadgeRewardDto> NewBadges { get; set; } = new();
    }
}
