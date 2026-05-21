using EliteFit.Application.DTOs.Workout;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Workout
{
    public record GetWorkoutsQuery(string? Category, string? Difficulty, string? MuscleGroup, string BaseUrl = "")
        : IRequest<IEnumerable<WorkoutDto>>;

    public class GetWorkoutsQueryHandler : IRequestHandler<GetWorkoutsQuery, IEnumerable<WorkoutDto>>
    {
        private readonly IWorkoutRepository _repo;
        public GetWorkoutsQueryHandler(IWorkoutRepository repo) => _repo = repo;

        public async Task<IEnumerable<WorkoutDto>> Handle(GetWorkoutsQuery req, CancellationToken ct)
        {
            var workouts = await _repo.GetFilteredAsync(req.Category, req.Difficulty, req.MuscleGroup);
            return workouts.Select(w => Map(w, req.BaseUrl));
        }

        internal static WorkoutDto Map(Domain.Entities.Workout w, string baseUrl = "", string? label = null) => new(
            w.Id, w.Title, w.Description, w.Category?.Name,
            w.Difficulty, w.MuscleGroup, w.DurationMin, w.ThumbnailUrl, w.IsFeatured, label,
            w.PrimaryVideo?.Id,
            w.PrimaryVideo?.VideoFile != null
                ? $"{baseUrl}/{w.PrimaryVideo.VideoFile.FilePath.Replace('\\', '/')}"
                : null,
            w.PrimaryVideo?.Title
        );
    }
}
