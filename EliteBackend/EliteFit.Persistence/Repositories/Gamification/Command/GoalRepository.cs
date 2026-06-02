using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Persistence.Repositories.Gamification.Command
{
    public class GoalRepository : IGoalRepository
    {
        private readonly ApplicationDbContext _context;

        public GoalRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Goal>> GetAllGoalsAsync(CancellationToken cancellationToken)
        {
            return await _context.Goals.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<List<UserGoal>> GetUserGoalsAsync(int userId, CancellationToken cancellationToken)
        {
            return await _context.UserGoals
                .Include(ug => ug.Goal)
                .Where(ug => ug.UserId == userId)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task ClearUserGoalsAsync(int userId, CancellationToken cancellationToken)
        {
            var existing = await _context.UserGoals.Where(ug => ug.UserId == userId).ToListAsync(cancellationToken);
            if (existing.Any())
            {
                _context.UserGoals.RemoveRange(existing);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task AddUserGoalsAsync(List<UserGoal> userGoals, CancellationToken cancellationToken)
        {
            await _context.UserGoals.AddRangeAsync(userGoals, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
