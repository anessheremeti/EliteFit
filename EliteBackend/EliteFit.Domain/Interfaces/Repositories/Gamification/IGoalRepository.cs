using EliteFit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Gamification
{
    public interface IGoalRepository
    {
        Task<List<Goal>> GetAllGoalsAsync(CancellationToken cancellationToken);
        Task<List<UserGoal>> GetUserGoalsAsync(int userId, CancellationToken cancellationToken);
        Task ClearUserGoalsAsync(int userId, CancellationToken cancellationToken);
        Task AddUserGoalsAsync(List<UserGoal> userGoals, CancellationToken cancellationToken);
    }
}
