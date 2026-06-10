using System;
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

                DurationSeconds = v.DurationSeconds ?? 0,
                Difficulty = v.DifficultyLevel,
                MuscleGroup = v.MuscleGroup,
                EstimatedCaloriesBurned = v.EstimatedCaloriesBurned,

                // Mbaje këtë rresht, sepse është thelbësor për të shfaqur videon në React:
                VideoUrl = v.VideoFile != null ? v.VideoFile.FilePath : null
            }).ToList();
        }
    }
}