using EliteFit.Domain.Interfaces.Repositories.Personalization;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Persistence.Repositories.Personalization.Query
{
public class MealLogQueryRepository : IMealLogQueryRepository
    {
        private readonly ApplicationDbContext _context;

        public MealLogQueryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetTotalCaloriesConsumedAsync(int userId, DateTime date, CancellationToken cancellationToken)
        {
            var targetDate = date.Date;

            // Mbledhim të gjitha kaloritë e recetave të përfunduara për atë ditë
            return await _context.MealLogs
                .AsNoTracking()
                .Where(ml => ml.UserId == userId && ml.LogDate.Date == targetDate)
                .SumAsync(ml => ml.CaloriesConsumed, cancellationToken);
        }
    }
}
