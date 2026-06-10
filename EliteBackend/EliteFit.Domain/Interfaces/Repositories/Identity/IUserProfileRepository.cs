using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IUserProfileRepository
    {
        Task<UserProfile?> GetByUserIdAsync(int userId);
        Task UpsertAsync(UserProfile profile);
        Task SaveChangesAsync();
        Task<UserProfile> GetUserProfileAsync(int userId, CancellationToken cancellationToken);
        Task UpdateUserProfileAsync(UserProfile profile, CancellationToken cancellationToken);

        Task AddAsync(UserProfile profile);
    }
}
