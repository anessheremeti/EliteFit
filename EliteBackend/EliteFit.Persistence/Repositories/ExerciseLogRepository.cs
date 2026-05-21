using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class ExerciseLogRepository : IExerciseLogRepository
    {
        private readonly ApplicationDbContext _context;
        public ExerciseLogRepository(ApplicationDbContext context) => _context = context;

        public async Task<ExerciseLog?> GetByIdAsync(int id)
            => await _context.ExerciseLogs
                .Include(l => l.Exercise)
                .Include(l => l.Workout)
                .FirstOrDefaultAsync(l => l.Id == id);

        public async Task<(IEnumerable<ExerciseLog> Items, int TotalCount)> GetByUserIdAsync(
            int userId, int page = 1, int pageSize = 20)
        {
            var query = _context.ExerciseLogs
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CompletedAt ?? l.CreatedAt);

            var total = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(l => l.Exercise)
                .ToListAsync();

            return (items, total);
        }

        public async Task<IEnumerable<ExerciseLog>> GetByExerciseIdAsync(int userId, int exerciseId)
            => await _context.ExerciseLogs
                .Where(l => l.UserId == userId && l.ExerciseId == exerciseId)
                .OrderByDescending(l => l.CompletedAt ?? l.CreatedAt)
                .ToListAsync();

        public async Task<IEnumerable<ExerciseLog>> GetByUserAndBodyPartAsync(
            int userId, string bodyPart, int limit = 50)
            => await _context.ExerciseLogs
                .Where(l => l.UserId == userId && l.BodyPart == bodyPart)
                .OrderByDescending(l => l.CompletedAt ?? l.CreatedAt)
                .Take(limit)
                .Include(l => l.Exercise)
                .ToListAsync();

        public async Task<IEnumerable<ExerciseLog>> GetRecentByUserIdAsync(int userId, int count = 10)
            => await _context.ExerciseLogs
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CompletedAt ?? l.CreatedAt)
                .Take(count)
                .Include(l => l.Exercise)
                .ToListAsync();

        public async Task<IEnumerable<(string BodyPart, int TotalCalories, int TotalSeconds, int SessionCount)>>
            GetBodyPartSummaryAsync(int userId)
        {
            var rows = await _context.ExerciseLogs
                .Where(l => l.UserId == userId && l.BodyPart != null)
                .GroupBy(l => l.BodyPart!)
                .Select(g => new
                {
                    BodyPart      = g.Key,
                    TotalCalories = g.Sum(l => l.CaloriesBurned ?? 0),
                    TotalSeconds  = g.Sum(l => l.DurationSeconds ?? 0),
                    SessionCount  = g.Count(),
                })
                .ToListAsync();

            return rows.Select(r => (r.BodyPart, r.TotalCalories, r.TotalSeconds, r.SessionCount));
        }

        public async Task AddAsync(ExerciseLog log)
            => await _context.ExerciseLogs.AddAsync(log);

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
