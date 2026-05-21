using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IWorkoutRepository
    {
        Task<Workout?> GetByIdAsync(int id);
        Task<Workout?> GetByIdWithVideoAsync(int id);
        Task<IEnumerable<Workout>> GetAllAsync();
        Task<IEnumerable<Workout>> GetFeaturedAsync(int count = 3);
        Task<IEnumerable<Workout>> GetFilteredAsync(string? category, string? difficulty, string? muscleGroup);
        Task<IEnumerable<Workout>> GetRelatedAsync(int excludeId, string? category, int limit);
        Task<IEnumerable<string>> GetCategoriesAsync();
        Task<IEnumerable<UserWorkoutProgress>> GetUserProgressAsync(int userId, int limit = 4);
        Task AddAsync(Workout workout);
        Task SaveChangesAsync();
    }
}
