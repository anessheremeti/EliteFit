using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class GoalRepository : IGoalRepository
    {
        private readonly ApplicationDbContext _context;

        public GoalRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Goal>> GetAllAsync()
            => await _context.Goals.OrderBy(g => g.Name).ToListAsync();

        public async Task<IEnumerable<UserGoal>> GetUserGoalsAsync(int userId)
            => await _context.UserGoals
                .Include(ug => ug.Goal)
                .Where(ug => ug.UserId == userId)
                .ToListAsync();

        public async Task SaveUserGoalsAsync(int userId, IEnumerable<int> goalIds)
        {
            var existing = await _context.UserGoals
                .Where(ug => ug.UserId == userId)
                .ToListAsync();

            _context.UserGoals.RemoveRange(existing);

            var incoming = goalIds.Select(goalId => new UserGoal
            {
                UserId = userId,
                GoalId = goalId
            });

            await _context.UserGoals.AddRangeAsync(incoming);
        }

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
