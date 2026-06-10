using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Reports;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories.Reports
{
    public class ReportRepository : IReportRepository
    {
        private readonly ApplicationDbContext _context;

        public ReportRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserWorkoutHistory>> GetWorkoutHistoryReportAsync(
            string userId,
            DateTime? fromDate,
            DateTime? toDate,
            int? categoryId,
            CancellationToken cancellationToken)
        {
            // Përdorim JOIN të pastër në bazë të kolonave që pamë në skriptën tënde të DB-së
            var query = from history in _context.Set<UserWorkoutHistory>()
                        join video in _context.Set<WorkoutVideo>() on history.VideoId equals video.Id
                        join u in _context.Set<User>() on history.UserId equals u.Id // Nëse klasa quhet 'user' me të vogla, ndryshoje në user
                        join cat in _context.Set<ExerciseCategory>() on video.CategoryId equals cat.Id into catGroup
                        from subCat in catGroup.DefaultIfEmpty() // Left Join në rast se ndonjë video s'ka kategori
                        select new { history, video, u, subCat };

            // Aplikimi i filtrave dinamikë
            if (fromDate.HasValue)
            {
                query = query.Where(x => x.history.CompletedAt >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                var endOfDay = toDate.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(x => x.history.CompletedAt <= endOfDay);
            }

            if (categoryId.HasValue)
            {
                query = query.Where(x => x.video.CategoryId == categoryId.Value);
            }

            // Ekzekutojmë query-n dhe i mbushim përkohësisht objektet e navigimit që t'i kemi gati për Handler-in
            var result = await query
                .OrderByDescending(x => x.history.CompletedAt)
                .ToListAsync(cancellationToken);

            return result.Select(x => {
                // Këto veti do t'i përdorim në Handler. 
                // Nëse në klasën tënde 'UserWorkoutHistory' vetitë quhen ndryshe (p.sh. 'Video' ose 'WorkoutVideo'), përshtati këtu:
                x.history.User = x.u;
                x.history.Video = x.video;
                return x.history;
            }).ToList();
        }
    }
}