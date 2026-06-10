using EliteFit.Application.DTOs.Workouts;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace EliteFit.Application.Features.Workouts.Queries.GetFeaturedVideos
{
    public class GetFeaturedVideosQueryHandler : IRequestHandler<GetFeaturedVideosQuery, List<WorkoutVideoDto>>
    {
        private readonly IWorkoutVideoRepository _repo;
        public GetFeaturedVideosQueryHandler(IWorkoutVideoRepository repo) => _repo = repo;

        public async Task<List<WorkoutVideoDto>> Handle(GetFeaturedVideosQuery request, CancellationToken ct)
        {
            var videos = await _repo.GetFeaturedVideosAsync(ct);

            return videos.Select(v => new WorkoutVideoDto
            {
                Id = v.Id,
                Title = v.Title,
                Description = v.Description,
                // Nëse Category është objekt, aksesoje emrin. Nëse është ID, mund ta lësh kështu:
                Category = v.Category?.Name ?? "General",
                Difficulty = v.DifficultyLevel,
                DurationSeconds = v.DurationSeconds ?? 0,
                // DurationMin nuk është te DTO, kështu që nuk e vendosim këtu, 
                // ose shtoje te DTO nëse e do.
                MuscleGroup = v.MuscleGroup,
                EstimatedCaloriesBurned = v.EstimatedCaloriesBurned,
            
            }).ToList();
        }
    }
}