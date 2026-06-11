using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories.Identity
{
    public interface IRefreshTokenRepository
    {
        Task AddAsync(RefreshToken token);
        Task<RefreshToken?> GetActiveByTokenHashAsync(string tokenHash);
        Task RevokeAllForUserAsync(int userId);
        Task SaveChangesAsync();
    }
}
