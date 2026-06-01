using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IGoalRepository
    {
        Task<IEnumerable<Goal>> GetAllAsync();
        Task<IEnumerable<UserGoal>> GetUserGoalsAsync(int userId);
        Task SaveUserGoalsAsync(int userId, IEnumerable<int> goalIds);
        Task SaveChangesAsync();
    }
}
