using EliteFit.Domain.Entities; // Namespace ku e ke entitetin WorkoutVideo
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IWorkoutRepository
    {
        Task<IEnumerable<WorkoutVideo>> GetVideosWithFiltersAsync(int? categoryId, string? difficultyLevel, CancellationToken cancellationToken);

        Task AddAsync(WorkoutVideo workoutVideo, CancellationToken cancellationToken);
    }


}