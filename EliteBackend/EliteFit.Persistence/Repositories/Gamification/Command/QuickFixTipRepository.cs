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
    public class QuickFixTipRepository : IQuickFixTipRepository
    {
        private readonly ApplicationDbContext _context;

        public QuickFixTipRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<QuickFixTip>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.QuickFixTips.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<QuickFixTip?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.QuickFixTips.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task<int> AddAsync(QuickFixTip tip, CancellationToken cancellationToken)
        {
            await _context.QuickFixTips.AddAsync(tip, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return tip.Id;
        }

        public async Task<bool> UpdateAsync(QuickFixTip tip, CancellationToken cancellationToken)
        {
            _context.QuickFixTips.Update(tip);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(QuickFixTip tip, CancellationToken cancellationToken)
        {
            _context.QuickFixTips.Remove(tip);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
