namespace EliteFit.Domain.Entities
{
    public class Workout : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? CategoryId { get; set; }
        public string Difficulty { get; set; } = string.Empty;
        public string? MuscleGroup { get; set; }
        public short DurationMin { get; set; }
        public string? ThumbnailUrl { get; set; }
        public int? PrimaryVideoId { get; set; }
        public bool IsFeatured { get; set; }
        public int SortOrder { get; set; }

        public ExerciseCategory? Category { get; set; }
        public WorkoutVideo? PrimaryVideo { get; set; }
        public ICollection<UserWorkoutProgress> UserProgress { get; set; } = new List<UserWorkoutProgress>();
        public ICollection<UserWorkoutFavorite> Favorites { get; set; } = new List<UserWorkoutFavorite>();
        public ICollection<ExerciseLog> ExerciseLogs { get; set; } = new List<ExerciseLog>();
    }
}
