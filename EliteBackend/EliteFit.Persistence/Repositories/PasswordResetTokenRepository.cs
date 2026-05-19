using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class PasswordResetTokenRepository : IPasswordResetTokenRepository
    {
        private readonly ApplicationDbContext _context;

        public PasswordResetTokenRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(PasswordResetToken token)
            => await _context.PasswordResetTokens.AddAsync(token);

        public async Task<PasswordResetToken?> GetByTokenHashAsync(string tokenHash)
            => await _context.PasswordResetTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

        public async Task InvalidateExistingTokensAsync(int userId)
        {
            var activeTokens = await _context.PasswordResetTokens
                .Where(t => t.UserId == userId && t.UsedAt == null)
                .ToListAsync();

            foreach (var token in activeTokens)
                token.UsedAt = DateTime.UtcNow;
        }

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
