using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Personalization;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Persistence.Repositories.Personalization.Queries
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
        public async Task<UserProfile> GetUserProfileAsync(int userId, CancellationToken cancellationToken)
        {
            // Kjo metodë tërheq krejt rreshtin nga tabela [user_profiles] për atë UserId
            return await _context.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(up => up.UserId == userId, cancellationToken);
        }

        public async Task<List<int>> GetUserGoalIdsAsync(int userId, CancellationToken cancellationToken)
        {
            // Kjo metodë tërheq listën e ID-ve të qëllimeve nga tabela [user_goals]
            return await _context.UserGoals
                .AsNoTracking()
                .Where(ug => ug.UserId == userId)
                .Select(ug => ug.GoalId)
                .ToListAsync(cancellationToken);
        }

        public async Task UpdateUserProfileAsync(Domain.Entities.UserProfile profile, CancellationToken cancellationToken)
        {
            _context.UserProfiles.Update(profile);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
