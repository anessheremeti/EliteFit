using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Workouts
{
    public class WorkoutVideoDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }
        public int? DurationSeconds { get; set; }
        public string DifficultyLevel { get; set; }
        public string MuscleGroup { get; set; }
        public int? EstimatedCaloriesBurned { get; set; }
    }
}
