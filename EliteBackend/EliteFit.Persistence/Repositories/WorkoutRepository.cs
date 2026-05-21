using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class WorkoutRepository : IWorkoutRepository
    {
        private readonly ApplicationDbContext _context;

        public WorkoutRepository(ApplicationDbContext context) => _context = context;

        public async Task<Workout?> GetByIdAsync(int id)
            => await _context.Workouts
                .Include(w => w.Category)
                .Include(w => w.PrimaryVideo)
                .FirstOrDefaultAsync(w => w.Id == id);

        public async Task<Workout?> GetByIdWithVideoAsync(int id)
            => await _context.Workouts
                .Include(w => w.Category)
                .Include(w => w.PrimaryVideo)
                    .ThenInclude(v => v!.VideoFile)
                .FirstOrDefaultAsync(w => w.Id == id);

        public async Task<IEnumerable<Workout>> GetAllAsync()
            => await _context.Workouts
                .Include(w => w.Category)
                .Include(w => w.PrimaryVideo).ThenInclude(v => v!.VideoFile)
                .OrderBy(w => w.SortOrder)
                .ToListAsync();

        public async Task<IEnumerable<Workout>> GetFeaturedAsync(int count = 3)
            => await _context.Workouts
                .Include(w => w.Category)
                .Include(w => w.PrimaryVideo).ThenInclude(v => v!.VideoFile)
                .Where(w => w.IsFeatured)
                .OrderBy(w => w.SortOrder)
                .Take(count)
                .ToListAsync();

        public async Task<IEnumerable<Workout>> GetFilteredAsync(string? category, string? difficulty, string? muscleGroup)
        {
            var query = _context.Workouts
                .Include(w => w.Category)
                .Include(w => w.PrimaryVideo).ThenInclude(v => v!.VideoFile)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category) && category != "All")
                query = query.Where(w => w.Category != null && w.Category.Name == category);

            if (!string.IsNullOrEmpty(difficulty) && difficulty != "All")
                query = query.Where(w => w.Difficulty == difficulty);

            if (!string.IsNullOrEmpty(muscleGroup) && muscleGroup != "All")
                query = query.Where(w => w.MuscleGroup == muscleGroup);

            return await query.OrderBy(w => w.SortOrder).ToListAsync();
        }

        public async Task<IEnumerable<Workout>> GetRelatedAsync(int excludeId, string? category, int limit)
        {
            var query = _context.Workouts
                .Include(w => w.Category)
                .Include(w => w.PrimaryVideo).ThenInclude(v => v!.VideoFile)
                .Where(w => w.Id != excludeId)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(w => w.Category != null && w.Category.Name == category);

            return await query.OrderBy(w => w.SortOrder).Take(limit).ToListAsync();
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync()
            => await _context.Workouts
                .Include(w => w.Category)
                .Where(w => w.Category != null)
                .Select(w => w.Category!.Name)
                .Distinct()
                .OrderBy(n => n)
                .ToListAsync();

        public async Task<IEnumerable<UserWorkoutProgress>> GetUserProgressAsync(int userId, int limit = 4)
            => await _context.UserWorkoutProgresses
                .Include(p => p.Workout)
                .Where(p => p.UserId == userId && p.CompletedAt == null)
                .OrderByDescending(p => p.LastWatchedAt)
                .Take(limit)
                .ToListAsync();

        public async Task AddAsync(Workout workout) => await _context.Workouts.AddAsync(workout);

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
