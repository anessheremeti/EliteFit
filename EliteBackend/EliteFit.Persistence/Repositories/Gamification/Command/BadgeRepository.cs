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
    public class BadgeRepository : IBadgeRepository
    {
        private readonly ApplicationDbContext _context;

        public BadgeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<(Badge Badge, string? IconPath)>> GetAllWithIconsAsync(CancellationToken cancellationToken)
        {
            var result = await _context.Badges
                .AsNoTracking()
                .Select(b => new
                {
                    Badge = b,
                    IconPath = _context.Files.Where(f => f.Id == b.BadgeIconId).Select(f => f.FilePath).FirstOrDefault()
                })
                .ToListAsync(cancellationToken);

            return result.Select(r => (r.Badge, r.IconPath)).ToList();
        }

        public async Task<(Badge Badge, string? IconPath)?> GetWithIconByIdAsync(int id, CancellationToken cancellationToken)
        {
            var badge = await _context.Badges.FindAsync(new object[] { id }, cancellationToken);
            if (badge == null) return null;

            var iconPath = await _context.Files
                .Where(f => f.Id == badge.BadgeIconId)
                .Select(f => f.FilePath)
                .FirstOrDefaultAsync(cancellationToken);

            return (badge, iconPath);
        }

        public async Task<Badge?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Badges.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task<bool> IconExistsAsync(int iconId, CancellationToken cancellationToken)
        {
            return await _context.Files.AnyAsync(f => f.Id == iconId, cancellationToken);
        }

        public async Task<int> AddAsync(Badge badge, CancellationToken cancellationToken)
        {
            await _context.Badges.AddAsync(badge, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return badge.Id;
        }

        public async Task<bool> UpdateAsync(Badge badge, CancellationToken cancellationToken)
        {
            _context.Badges.Update(badge);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(Badge badge, CancellationToken cancellationToken)
        {
            _context.Badges.Remove(badge);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
