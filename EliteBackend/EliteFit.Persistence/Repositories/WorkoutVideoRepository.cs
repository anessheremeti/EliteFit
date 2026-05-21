using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class WorkoutVideoRepository : IWorkoutVideoRepository
    {
        private readonly ApplicationDbContext _context;

        public WorkoutVideoRepository(ApplicationDbContext context) => _context = context;

        public async Task<WorkoutVideo?> GetByIdAsync(int id)
            => await _context.WorkoutVideos
                .Include(v => v.VideoFile)
                .Include(v => v.Category)
                .FirstOrDefaultAsync(v => v.Id == id);

        public async Task<IEnumerable<WorkoutVideo>> GetAllAsync()
            => await _context.WorkoutVideos
                .Include(v => v.VideoFile)
                .Include(v => v.Category)
                .OrderBy(v => v.Title)
                .ToListAsync();

        public async Task<IEnumerable<WorkoutVideo>> GetByCategoryNameAsync(string categoryName)
            => await _context.WorkoutVideos
                .Include(v => v.VideoFile)
                .Include(v => v.Category)
                .Where(v => v.Category != null && v.Category.Name == categoryName)
                .OrderBy(v => v.Title)
                .ToListAsync();

        public async Task<bool> ExistsAsync(string exerciseName)
            => await _context.WorkoutVideos.AnyAsync(v => v.ExerciseName == exerciseName);

        public async Task AddAsync(WorkoutVideo video) => await _context.WorkoutVideos.AddAsync(video);

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
