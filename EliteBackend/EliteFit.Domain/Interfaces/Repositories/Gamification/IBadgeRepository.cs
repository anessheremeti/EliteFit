using EliteFit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Gamification
{
    public interface IBadgeRepository
    {
        Task<List<(Badge Badge, string? IconPath)>> GetAllWithIconsAsync(CancellationToken cancellationToken);
        Task<(Badge Badge, string? IconPath)?> GetWithIconByIdAsync(int id, CancellationToken cancellationToken);
        Task<Badge?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<bool> IconExistsAsync(int iconId, CancellationToken cancellationToken);
        Task<int> AddAsync(Badge badge, CancellationToken cancellationToken);
        Task<bool> UpdateAsync(Badge badge, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(Badge badge, CancellationToken cancellationToken);
    }
}
