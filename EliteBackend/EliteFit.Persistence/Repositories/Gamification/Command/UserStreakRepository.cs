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
    public class UserStreakRepository : IUserStreakRepository
    {
        private readonly ApplicationDbContext _context;

        public UserStreakRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserStreak?> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            // Në tabelën tënde UserStreaks, UserId është Primary Key
            return await _context.UserStreaks.FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
        }

        public async Task<List<UserStreak>> GetAllStreaksAsync(CancellationToken cancellationToken)
        {
            return await _context.UserStreaks.ToListAsync(cancellationToken);
        }

        public async Task UpdateAsync(UserStreak streak, CancellationToken cancellationToken)
        {
            _context.UserStreaks.Update(streak);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
