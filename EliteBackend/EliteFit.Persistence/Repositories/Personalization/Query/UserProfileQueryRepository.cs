using EliteFit.Domain.Interfaces.Repositories.Personalization;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Persistence.Repositories.Personalization.Query
{
    public class UserProfileQueryRepository : IUserProfileQueryRepository
    {
        private readonly ApplicationDbContext _context;

        public UserProfileQueryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<int>> GetUserAllergyIdsAsync(int userId, CancellationToken cancellationToken)
        {
            return await _context.UserAllergies
                .AsNoTracking()
                .Where(ua => ua.UserId == userId)
                .Select(ua => ua.AllergyId)
                .ToListAsync(cancellationToken);
        }

        public async Task<int?> GetDailyCalorieTargetAsync(int userId, CancellationToken cancellationToken)
        {
            var profile = await _context.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(up => up.UserId == userId, cancellationToken);

            return profile?.DailyCalorieTarget;
        }
    }
}
