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
    public class UserBadgeRepository : IUserBadgeRepository
    {
        private readonly ApplicationDbContext _context;

        public UserBadgeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserBadge>> GetBadgesByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            // Përdor Include për të marrë të dhënat e Badge dhe Files (Ikonën)
            return await _context.UserBadges
                .Include(ub => ub.Badge)
                .ThenInclude(b => b.BadgeIcon)
                .Where(ub => ub.UserId == userId)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<int> GetWorkoutCountAsync(int userId, CancellationToken cancellationToken)
        {
            return await _context.UserWorkoutHistories
                .CountAsync(u => u.UserId == userId, cancellationToken);
        }

        public async Task<bool> HasBadgeAsync(int userId, int badgeId, CancellationToken cancellationToken)
        {
            return await _context.UserBadges
                .AnyAsync(ub => ub.UserId == userId && ub.BadgeId == badgeId, cancellationToken);
        }

        public async Task AddUserBadgeAsync(UserBadge userBadge, CancellationToken cancellationToken)
        {
            await _context.UserBadges.AddAsync(userBadge, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
