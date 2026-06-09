using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Workouts;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using MediatR;

namespace EliteFit.Application.Features.Workouts.Queries.GetWorkoutVideos
{
    public class GetWorkoutVideosQueryHandler : IRequestHandler<GetWorkoutVideosQuery, List<WorkoutVideoDto>>
    {
        private readonly IWorkoutVideoRepository _workoutVideoRepository;

        public GetWorkoutVideosQueryHandler(IWorkoutVideoRepository workoutVideoRepository)
        {
            _workoutVideoRepository = workoutVideoRepository;
        }

        public async Task<List<WorkoutVideoDto>> Handle(GetWorkoutVideosQuery request, CancellationToken cancellationToken)
        {
            var videos = await _workoutVideoRepository.GetFilteredVideosAsync(request.CategoryId, request.DifficultyLevel, cancellationToken);

            return videos.Select(v => new WorkoutVideoDto
            {
                Id = v.Id,
                Title = v.Title,
                Description = v.Description,
                CategoryId = v.CategoryId,
                DurationSeconds = v.DurationSeconds,
                DifficultyLevel = v.DifficultyLevel,
                MuscleGroup = v.MuscleGroup,
                EstimatedCaloriesBurned = v.EstimatedCaloriesBurned,

                // RREGULLIMI: Marrim linkun e YouTube nga FileEntity dhe e kalojmë në DTO
                VideoUrl = v.VideoFile != null ? v.VideoFile.FilePath : null
            }).ToList();
        }
    }
}