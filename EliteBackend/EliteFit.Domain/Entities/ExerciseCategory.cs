namespace EliteFit.Domain.Entities
{
    public class ExerciseCategory : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public ICollection<WorkoutVideo> WorkoutVideos { get; set; } = new List<WorkoutVideo>();
        public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    }
}
