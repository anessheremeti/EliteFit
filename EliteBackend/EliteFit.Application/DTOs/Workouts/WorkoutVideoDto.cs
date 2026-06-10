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
        public string Category { get; set; } // Do ta marrim nga tabela ExerciseCategories
        public int DurationSeconds { get; set; }
        public string Difficulty { get; set; } // Myn te DifficultyLevel
        public string MuscleGroup { get; set; }
        public int? EstimatedCaloriesBurned { get; set; }

        // SHTO KËTË RRESHT:
        public string VideoUrl { get; set; }
    }
}
