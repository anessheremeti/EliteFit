using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using EliteFit.Application.DTOs.Workouts;
using EliteFit.Domain.Interfaces.Repositories.Workout;

namespace EliteFit.Application.Features.Workouts.Queries.SearchWorkoutsQuery
{
    public class SearchWorkoutsQueryHandler : IRequestHandler<SearchWorkoutsQuery, List<WorkoutVideoDto>>
    {
        private readonly IWorkoutVideoRepository _workoutVideoRepository;

        public SearchWorkoutsQueryHandler(IWorkoutVideoRepository workoutVideoRepository)
        {
            _workoutVideoRepository = workoutVideoRepository;
        }

        public async Task<List<WorkoutVideoDto>> Handle(SearchWorkoutsQuery request, CancellationToken cancellationToken)
        {
            // Përdorim '_' për të injoruar TotalCount pasi nuk na duhet më wrapper-i
            var (videos, _) = await _workoutVideoRepository.SearchWorkoutVideosAsync(
                request.SearchTerm,
                request.Difficulty,
                request.MuscleGroup,
                request.Duration,
                request.SortBy,
                request.PageNumber,
                request.PageSize,
                cancellationToken
            );

            // Mapojmë entitetet dhe kthejmë direkt listën e DTOs
            return videos.Select(v => new WorkoutVideoDto
            {
                Id = v.Id,
                Title = v.Title ?? string.Empty,
                Description = v.Description ?? string.Empty,
                Category = v.Category != null ? v.Category.Name : "E pacaktuar",
                DurationSeconds = v.DurationSeconds ?? 0,
                Difficulty = v.DifficultyLevel ?? string.Empty,
                MuscleGroup = v.MuscleGroup ?? string.Empty,
                EstimatedCaloriesBurned = v.EstimatedCaloriesBurned,
                VideoUrl = v.VideoFile != null ? v.VideoFile.FilePath : null
            }).ToList();
        }
    }
}