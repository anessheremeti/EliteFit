using EliteFit.Application.DTOs;
using EliteFit.Application.DTOs.Workout;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Queries.Workouts
{
    public record GetWorkoutVideosQuery(int? CategoryId, string? DifficultyLevel) : IRequest<IEnumerable<WorkoutVideoDto>>;

    public class GetWorkoutVideosQueryHandler : IRequestHandler<GetWorkoutVideosQuery, IEnumerable<WorkoutVideoDto>>
    {
        private readonly IWorkoutRepository _workoutRepository;

        public GetWorkoutVideosQueryHandler(IWorkoutRepository workoutRepository)
        {
            _workoutRepository = workoutRepository;
        }

        public async Task<IEnumerable<WorkoutVideoDto>> Handle(GetWorkoutVideosQuery query, CancellationToken cancellationToken)
        {
            // 1. Marrim entitetet e domenit nga Repository
            var videos = await _workoutRepository.GetVideosWithFiltersAsync(query.CategoryId, query.DifficultyLevel, cancellationToken);

            // 2. Bëjmë mapimin brenda Application në listën e DTO-ve
            return videos.Select(v => new WorkoutVideoDto
            {
                Id = v.Id,
                Title = v.Title,
                Description = v.Description,
                VideoFileId = v.VideoFileId,
                CategoryId = v.CategoryId,
                CategoryName = v.Category != null ? v.Category.Name : string.Empty,
                DurationSeconds = v.DurationSeconds,
                DifficultyLevel = v.DifficultyLevel,
                MuscleGroup = v.MuscleGroup,
                EstimatedCaloriesBurned = v.EstimatedCaloriesBurned
            });
        }
    }
}