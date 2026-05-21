namespace EliteFit.Domain.Entities
{
    public class UserWorkoutProgress : BaseEntity
    {
        public int UserId { get; set; }
        public int WorkoutId { get; set; }
        public byte ProgressPct { get; set; }
        public DateTime LastWatchedAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        public User? User { get; set; }
        public Workout? Workout { get; set; }
    }
}
