using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class WorkoutVideo : BaseEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public int? VideoFileId { get; set; }
        public int? CategoryId { get; set; }

        public int? DurationSeconds { get; set; }
        public string DifficultyLevel { get; set; }
        public string MuscleGroup { get; set; }
        public int? EstimatedCaloriesBurned { get; set; }

        public FileEntity VideoFile { get; set; }
        public ExerciseCategory Category { get; set; }

        public ICollection<UserWorkoutHistory> WorkoutHistories { get; set; }
    }
}
