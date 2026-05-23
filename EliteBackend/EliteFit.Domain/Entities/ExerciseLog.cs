namespace EliteFit.Domain.Entities
{
    public class ExerciseLog : BaseEntity
    {
        public int UserId { get; set; }

        // FK to workout_videos — nullable to allow logging custom (non-library) exercises
        public int? ExerciseId { get; set; }

        // Denormalized: populated from WorkoutVideo on write; supports analytics without JOIN
        public string ExerciseName { get; set; } = string.Empty;

        // Denormalized muscle group / body part (e.g. "Core", "Upper Body")
        public string? BodyPart { get; set; }

        // Optional FK back to a workout plan session that contained this exercise
        public int? WorkoutId { get; set; }

        public int? CaloriesBurned { get; set; }
        public int? DurationSeconds { get; set; }
        public DateTime? CompletedAt { get; set; }

        // Free-text notes / form cues for future progress-tracking features
        public string? Notes { get; set; }

        // Navigation properties
        public User? User { get; set; }
        public WorkoutVideo? Exercise { get; set; }
        public Workout? Workout { get; set; }
    }
}
