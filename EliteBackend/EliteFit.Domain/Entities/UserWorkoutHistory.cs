using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class UserWorkoutHistory : BaseEntity
    {
        public int UserId { get; set; }
        public int VideoId { get; set; }
        public int? CaloriesBurned { get; set; }
        public int? TimeWatchedSeconds { get; set; }
        public DateTime? CompletedAt { get; set; }

        public User? User { get; set; }
        public WorkoutVideo? Video { get; set; }
    }
}
