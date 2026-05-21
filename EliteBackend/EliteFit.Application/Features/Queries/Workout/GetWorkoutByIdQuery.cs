using EliteFit.Application.DTOs.Workout;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Workout
{
    public record GetWorkoutByIdQuery(int Id, string BaseUrl = "") : IRequest<WorkoutDto?>;

    public class GetWorkoutByIdQueryHandler : IRequestHandler<GetWorkoutByIdQuery, WorkoutDto?>
    {
        private readonly IWorkoutRepository _repo;
        public GetWorkoutByIdQueryHandler(IWorkoutRepository repo) => _repo = repo;

        public async Task<WorkoutDto?> Handle(GetWorkoutByIdQuery req, CancellationToken ct)
        {
            var w = await _repo.GetByIdWithVideoAsync(req.Id);
            if (w is null) return null;

            int? videoId = null;
            string? videoUrl = null;
            string? videoTitle = null;

            if (w.PrimaryVideo?.VideoFile != null)
            {
                videoId = w.PrimaryVideo.Id;
                videoTitle = w.PrimaryVideo.Title;
                videoUrl = $"{req.BaseUrl}/{w.PrimaryVideo.VideoFile.FilePath.Replace('\\', '/')}";
            }

            return new WorkoutDto(
                w.Id, w.Title, w.Description, w.Category?.Name,
                w.Difficulty, w.MuscleGroup, w.DurationMin, w.ThumbnailUrl, w.IsFeatured, null,
                videoId, videoUrl, videoTitle
            );
        }
    }
}
