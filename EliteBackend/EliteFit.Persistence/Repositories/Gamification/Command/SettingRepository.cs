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
    public class SettingRepository : ISettingRepository
    {
        private readonly ApplicationDbContext _context;

        public SettingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Setting>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Settings.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<Setting?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Settings.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task<Setting?> GetByKeyAsync(string key, CancellationToken cancellationToken)
        {
            // Kërkon një cilësim direkt nga emri i Key-t
            return await _context.Settings.FirstOrDefaultAsync(s => s.Key == key, cancellationToken);
        }

        public async Task<int> AddAsync(Setting setting, CancellationToken cancellationToken)
        {
            await _context.Settings.AddAsync(setting, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return setting.Id;
        }

        public async Task<bool> UpdateAsync(Setting setting, CancellationToken cancellationToken)
        {
            _context.Settings.Update(setting);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(Setting setting, CancellationToken cancellationToken)
        {
            _context.Settings.Remove(setting);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
