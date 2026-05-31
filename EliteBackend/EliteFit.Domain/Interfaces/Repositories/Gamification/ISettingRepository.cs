using EliteFit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Gamification
{
    public interface ISettingRepository
    {
        Task<List<Setting>> GetAllAsync(CancellationToken cancellationToken);
        Task<Setting?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<Setting?> GetByKeyAsync(string key, CancellationToken cancellationToken); 
        Task<int> AddAsync(Setting setting, CancellationToken cancellationToken);
        Task<bool> UpdateAsync(Setting setting, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(Setting setting, CancellationToken cancellationToken);
    }
}
