using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Persistence.Repositories
{
    public class WorkoutRepository : IWorkoutRepository
    {
        private readonly ApplicationDbContext _context;

        public WorkoutRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WorkoutVideo>> GetVideosWithFiltersAsync(int? categoryId, string? difficultyLevel, CancellationToken cancellationToken)
        {
            var query = _context.WorkoutVideos
                .Include(v => v.Category)
                .AsNoTracking();

            if (categoryId.HasValue)
            {
                query = query.Where(v => v.CategoryId == categoryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(difficultyLevel))
            {
                query = query.Where(v => v.DifficultyLevel.ToLower() == difficultyLevel.ToLower().Trim());
            }

            return await query.ToListAsync(cancellationToken);
        }
        
        public async Task AddAsync(WorkoutVideo workoutVideo,CancellationToken cancellationToken)
        {
            await _context.Set<WorkoutVideo>().AddAsync(workoutVideo, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken) ;
        }

    }
}