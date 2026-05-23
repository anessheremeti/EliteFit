namespace EliteFit.Domain.Entities
{
    public class UserWorkoutFavorite
    {
        public int UserId { get; set; }
        public int WorkoutId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public Workout? Workout { get; set; }
    }
}
