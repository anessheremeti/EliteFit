using EliteFit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Gamification
{
    public interface IUserBadgeRepository
    {
        Task<List<UserBadge>> GetBadgesByUserIdAsync(int userId, CancellationToken cancellationToken);
        Task<int> GetWorkoutCountAsync(int userId, CancellationToken cancellationToken);
        Task<bool> HasBadgeAsync(int userId, int badgeId, CancellationToken cancellationToken);
        Task AddUserBadgeAsync(UserBadge userBadge, CancellationToken cancellationToken);
    }
}
