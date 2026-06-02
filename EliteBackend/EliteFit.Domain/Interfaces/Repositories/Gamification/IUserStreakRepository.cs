using EliteFit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Gamification
{
    public interface IUserStreakRepository
    {
        Task<UserStreak?> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
        Task<List<UserStreak>> GetAllStreaksAsync(CancellationToken cancellationToken);
        Task UpdateAsync(UserStreak streak, CancellationToken cancellationToken);
    }
}
