using EliteFit.Application.DTOs.Workout;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Workout
{
    public record GetWorkoutVideosQuery(string BaseUrl, string? Category = null)
        : IRequest<IEnumerable<WorkoutVideoDto>>;

    public class GetWorkoutVideosQueryHandler : IRequestHandler<GetWorkoutVideosQuery, IEnumerable<WorkoutVideoDto>>
    {
        private readonly IWorkoutVideoRepository _repo;
        public GetWorkoutVideosQueryHandler(IWorkoutVideoRepository repo) => _repo = repo;

        public async Task<IEnumerable<WorkoutVideoDto>> Handle(GetWorkoutVideosQuery req, CancellationToken ct)
        {
            var videos = string.IsNullOrEmpty(req.Category) || req.Category == "All"
                ? await _repo.GetAllAsync()
                : await _repo.GetByCategoryNameAsync(req.Category);

            return videos.Select(v => Map(v, req.BaseUrl));
        }

        internal static WorkoutVideoDto Map(WorkoutVideo v, string baseUrl) => new(
            v.Id,
            v.Title,
            v.ExerciseName,
            v.Category?.Name,
            v.MuscleGroup,
            v.DifficultyLevel,
            v.DurationSeconds,
            v.EstimatedCaloriesBurned,
            v.VideoFile != null
                ? $"{baseUrl}/{v.VideoFile.FilePath.Replace('\\', '/')}"
                : string.Empty
        );
    }
}
