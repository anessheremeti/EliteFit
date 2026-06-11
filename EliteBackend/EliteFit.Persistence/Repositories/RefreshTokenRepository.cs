using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Identity;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class RefreshTokenRepository(ApplicationDbContext context) : IRefreshTokenRepository
    {
        public async Task AddAsync(RefreshToken token)
            => await context.RefreshTokens.AddAsync(token);

        // Returns null if the hash is not found at all (caller distinguishes from revoked).
        public async Task<RefreshToken?> GetActiveByTokenHashAsync(string tokenHash)
            => await context.RefreshTokens
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

        // Revokes every active token for this user (used on reuse detection and explicit logout-all).
        public async Task RevokeAllForUserAsync(int userId)
        {
            var tokens = await context.RefreshTokens
                .Where(t => t.UserId == userId && t.RevokedAt == null)
                .ToListAsync();

            foreach (var t in tokens)
                t.RevokedAt = DateTime.UtcNow;
        }

        public async Task SaveChangesAsync()
            => await context.SaveChangesAsync();
    }
}
