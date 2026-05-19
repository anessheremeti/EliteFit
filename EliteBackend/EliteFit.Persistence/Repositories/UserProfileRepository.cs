using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public UserProfileRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfile?> GetByUserIdAsync(int userId)
            => await _context.UserProfiles.FirstOrDefaultAsync(up => up.UserId == userId);

        public async Task UpsertAsync(UserProfile profile)
        {
            var existing = await _context.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId == profile.UserId);

            if (existing is null)
            {
                await _context.UserProfiles.AddAsync(profile);
            }
            else
            {
                existing.Gender = profile.Gender;
                existing.Age = profile.Age;
                existing.WeightKg = profile.WeightKg;
                existing.HeightCm = profile.HeightCm;
                existing.WorkoutsPerWeek = profile.WorkoutsPerWeek;
                existing.MealsPerDay = profile.MealsPerDay;
                existing.DietType = profile.DietType;
                existing.OnboardingCompleted = profile.OnboardingCompleted;
                existing.DailyCalorieTarget = profile.DailyCalorieTarget;
            }
        }

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
