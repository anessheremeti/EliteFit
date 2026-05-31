using EliteFit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Gamification
{
    public interface IQuickFixTipRepository
    {
        Task<List<QuickFixTip>> GetAllAsync(CancellationToken cancellationToken);
        Task<QuickFixTip?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<int> AddAsync(QuickFixTip tip, CancellationToken cancellationToken);
        Task<bool> UpdateAsync(QuickFixTip tip, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(QuickFixTip tip, CancellationToken cancellationToken);
    }
}
