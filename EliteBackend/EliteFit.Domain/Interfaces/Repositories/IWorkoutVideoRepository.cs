using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IWorkoutVideoRepository
    {
        Task<WorkoutVideo?> GetByIdAsync(int id);
        Task<IEnumerable<WorkoutVideo>> GetAllAsync();
        Task<IEnumerable<WorkoutVideo>> GetByCategoryNameAsync(string categoryName);
        Task<bool> ExistsAsync(string exerciseName);
        Task AddAsync(WorkoutVideo video);
        Task SaveChangesAsync();
    }
}
