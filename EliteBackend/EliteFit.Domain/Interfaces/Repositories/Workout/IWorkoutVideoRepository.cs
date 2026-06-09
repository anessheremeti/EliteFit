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
        Task<WorkoutVideo> GetByIdAsync(int id,CancellationToken cancellationToken);    
        Task<List<WorkoutVideo>> GetFilteredVideosAsync(int? categoryId, string? difficultyLevel, CancellationToken cancellationToken);
        Task<int> AddAsync(WorkoutVideo workoutVideo, CancellationToken cancellationToken);

        Task AddHistoryAsync(UserWorkoutHistory history, CancellationToken cancellationToken);
        Task SaveChangesAsync(CancellationToken cancellationToken = default);
        Task UpdateAsync(WorkoutVideo workoutVideo, CancellationToken cancellationToken);
        Task DeleteAsync(WorkoutVideo workoutVideo, CancellationToken cancellationToken);


    }
}
