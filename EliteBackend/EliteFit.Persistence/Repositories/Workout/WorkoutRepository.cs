using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using EliteFit.Persistence.Persistence.Context;

namespace EliteFit.Persistence.Repositories;
public class WorkoutVideoRepository : IWorkoutVideoRepository
{
    private readonly ApplicationDbContext _context;

    public WorkoutVideoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<WorkoutVideo?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.WorkoutVideos
            .Include(v => v.VideoFile) // Bën Eager Loading për të marrë të dhënat e videos
            .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
    }
    // 1. Implementimi i Query-t (Leximi me filtra)
    public async Task<List<WorkoutVideo>> GetFilteredVideosAsync(int? categoryId, string? difficultyLevel, CancellationToken cancellationToken)
    {
        var query = _context.WorkoutVideos
           .Include(v => v.VideoFile)
           .Include("Category")
           .AsQueryable();

        if (categoryId.HasValue)
        {
            query = query.Where(v => v.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(difficultyLevel))
        {
            query = query.Where(v => v.DifficultyLevel == difficultyLevel);
        }

        return await query.ToListAsync(cancellationToken);
    }

    // 2. Implementimi i Command-it (Shtimi i rekordit të ri)
    public async Task<int> AddAsync(WorkoutVideo workoutVideo, CancellationToken cancellationToken)
    {
        _context.WorkoutVideos.Add(workoutVideo);

        // Ruhen ndryshimet në SQL Server
        await _context.SaveChangesAsync(cancellationToken);

        // Kthehet ID-ja që sapo u gjenerua nga databaza
        return workoutVideo.Id;
    }
    // 3. Përditësimi i një videoje ekzistuese (Update)
    public async Task UpdateAsync(WorkoutVideo workoutVideo, CancellationToken cancellationToken)
    {
        _context.WorkoutVideos.Update(workoutVideo);
        await _context.SaveChangesAsync(cancellationToken);
    }

    // 4. Fshirja e një videoje (Delete)
    public async Task DeleteAsync(WorkoutVideo workoutVideo, CancellationToken cancellationToken)
    {
        _context.WorkoutVideos.Remove(workoutVideo);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task AddHistoryAsync(UserWorkoutHistory history,CancellationToken cancellationToken)
    {
        await _context.Set<UserWorkoutHistory>().AddAsync(history, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
    public async Task<List<WorkoutVideo>> GetFeaturedVideosAsync(CancellationToken cancellationToken)
    {
        // Marrim 5 videot e fundit si të preferuara (ose mund të shtosh kolonën IsFeatured në model)
        return await _context.WorkoutVideos
            .OrderByDescending(v => v.Id)
            .Take(5)
            .ToListAsync(cancellationToken);
    }
    public async Task<List<UserWorkoutHistory>> GetUserHistoryAsync(int userId, CancellationToken cancellationToken)
    {
        return await _context.UserWorkoutHistories
            .Include(h => h.Video) // Shumë e rëndësishme që të marrim të dhënat e videos
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.CompletedAt)
            .Take(10) // Marrim 10 të fundit, ose sa të duash
            .ToListAsync(cancellationToken);
    }
    public async Task<int> GetCountByUserIdAsync(int userId, CancellationToken cancellationToken)
    {
        return await _context.UserWorkoutHistories
            .CountAsync(h => h.UserId == userId, cancellationToken);
    }

    public async Task<double> GetTotalHoursByUserIdAsync(int userId, CancellationToken cancellationToken)
    {
        // SQL skema jote ka "TimeWatchedSeconds", jo "Duration"
        var totalSeconds = await _context.UserWorkoutHistories
            .Where(h => h.UserId == userId)
            .SumAsync(h => h.TimeWatchedSeconds ?? 0, cancellationToken);

        return totalSeconds / 3600.0; // Konvertimi në orë
    }

    public async Task<int> GetCurrentStreakAsync(int userId, CancellationToken cancellationToken)
    {
        // Hapi 1: Marrim datat duke kontrolluar për null
        var dates = await _context.UserWorkoutHistories
            .Where(h => h.UserId == userId && h.CompletedAt.HasValue)
            .Select(h => h.CompletedAt!.Value.Date) // !.Value e kthen DateTime? në DateTime
            .Distinct()
            .OrderByDescending(d => d)
            .ToListAsync(cancellationToken);

        if (!dates.Any()) return 0;

        int streak = 0;
        DateTime lastDate = DateTime.UtcNow.Date;

        // Logjika e Streak: Kontrollojmë nëse datat janë radhazi
        foreach (var date in dates)
        {
            // Nëse data është sot ose dje, rrisim streak-un
            if (date == lastDate || date == lastDate.AddDays(-1))
            {
                streak++;
                lastDate = date;
            }
            else break;
        }
        return streak;
    }
    // Shto këtë metodë brenda klasës sate: WorkoutVideoRepository.cs
    public async Task<(List<WorkoutVideo> Videos, int TotalCount)> SearchWorkoutVideosAsync(
        string? searchTerm,
        string? difficulty,
        string? muscleGroup,
        string? duration,
        string? sortBy,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken)
    {
        // Fillojmë query-n bazë me Eager Loading (.Include) për Navigation Properties
        var query = _context.WorkoutVideos
            .Include(v => v.VideoFile) // Tabela Files (për VideoUrl)
            .Include("Category")       // Tabela ExerciseCategories (për Category Name)
            .AsQueryable();

        // 1. FILTRI: Search Bar (Titull ose Përshkrim)
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(v => v.Title.ToLower().Contains(term) ||
                                     v.Description.ToLower().Contains(term));
        }

        // 2. FILTRAT: Dropdowns nga UI
        if (!string.IsNullOrWhiteSpace(difficulty) && difficulty != "All")
        {
            query = query.Where(v => v.DifficultyLevel == difficulty);
        }

        if (!string.IsNullOrWhiteSpace(muscleGroup) && muscleGroup != "All")
        {
            query = query.Where(v => v.MuscleGroup == muscleGroup);
        }

        if (!string.IsNullOrWhiteSpace(duration) && duration != "All")
        {
            query = duration switch
            {
                "Short" => query.Where(v => v.DurationSeconds <= 900),
                "Medium" => query.Where(v => v.DurationSeconds > 900 && v.DurationSeconds <= 1800),
                "Long" => query.Where(v => v.DurationSeconds > 1800),
                _ => query
            };
        }

        // 3. Llogaritja e totalit para se të aplikohet Pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // 4. RENDITJA (Sorting)
        // 4. RENDITJA (Sorting) - RREGULLUAR
        query = sortBy switch
        {
            "short" => query.OrderBy(v => v.DurationSeconds),       // Përputhet me "short" nga React
            "long" => query.OrderByDescending(v => v.DurationSeconds), // Përputhet me "long"
            "calories" => query.OrderByDescending(v => v.EstimatedCaloriesBurned), // Përputhet me "calories"
            _ => query.OrderByDescending(v => v.Id) // Default
        };

        // 5. PAGINATION (Faqezimi)
        var videos = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (videos, totalCount);
    }
}