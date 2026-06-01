using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories.Personalization
{
    public interface IUserProfileQueryRepository
    {
        Task<List<int>> GetUserAllergyIdsAsync(int userId, CancellationToken cancellationToken);
        Task<int?> GetDailyCalorieTargetAsync(int userId, CancellationToken cancellationToken);
        Task<UserProfile> GetUserProfileAsync(int userId, CancellationToken cancellationToken);
        Task<List<int>> GetUserGoalIdsAsync(int userId, CancellationToken cancellationToken);
        Task UpdateUserProfileAsync(Entities.UserProfile profile, CancellationToken cancellationToken);
    }
}
