using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IExerciseLogRepository
    {
        Task<ExerciseLog?> GetByIdAsync(int id);

        /// <summary>Returns paginated exercise history for a user, newest first.</summary>
        Task<(IEnumerable<ExerciseLog> Items, int TotalCount)> GetByUserIdAsync(
            int userId, int page = 1, int pageSize = 20);

        /// <summary>Returns logs filtered by body part for per-muscle analytics.</summary>
        Task<IEnumerable<ExerciseLog>> GetByUserAndBodyPartAsync(int userId, string bodyPart, int limit = 50);

        /// <summary>Returns the most recent N logs for a user (dashboard / streak support).</summary>
        Task<IEnumerable<ExerciseLog>> GetRecentByUserIdAsync(int userId, int count = 10);

        /// <summary>Returns all logs for a specific exercise (video) for a user.</summary>
        Task<IEnumerable<ExerciseLog>> GetByExerciseIdAsync(int userId, int exerciseId);

        /// <summary>Aggregates calories and duration per body part (analytics).</summary>
        Task<IEnumerable<(string BodyPart, int TotalCalories, int TotalSeconds, int SessionCount)>>
            GetBodyPartSummaryAsync(int userId);

        Task AddAsync(ExerciseLog log);
        Task SaveChangesAsync();
    }
}
