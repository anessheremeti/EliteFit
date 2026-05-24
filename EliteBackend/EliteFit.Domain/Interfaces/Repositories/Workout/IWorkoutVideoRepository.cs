using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories.Workout
{
    public interface IWorkoutVideoRepository
    {
        Task<List<WorkoutVideo>> GetFilteredVideosAsync(int? categoryId, string? difficultyLevel, CancellationToken cancellationToken);
        Task<int> AddAsync(WorkoutVideo workoutVideo, CancellationToken cancellationToken);
    }
}
