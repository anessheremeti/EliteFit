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

    // 1. Implementimi i Query-t (Leximi me filtra)
    public async Task<List<WorkoutVideo>> GetFilteredVideosAsync(int? categoryId, string? difficultyLevel, CancellationToken cancellationToken)
    {
        var query = _context.WorkoutVideos
           .Include(v => v.VideoFile)
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
}