using EliteFit.Application.DTOs.Workout;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Workout
{
    public record GetContinueWatchingQuery(int UserId) : IRequest<IEnumerable<ContinueWatchingDto>>;

    public class GetContinueWatchingQueryHandler : IRequestHandler<GetContinueWatchingQuery, IEnumerable<ContinueWatchingDto>>
    {
        private readonly IWorkoutRepository _repo;
        public GetContinueWatchingQueryHandler(IWorkoutRepository repo) => _repo = repo;

        public async Task<IEnumerable<ContinueWatchingDto>> Handle(GetContinueWatchingQuery req, CancellationToken ct)
        {
            var progress = await _repo.GetUserProgressAsync(req.UserId);
            return progress.Select(p => new ContinueWatchingDto(
                p.Id,
                p.WorkoutId,
                p.Workout?.Title ?? string.Empty,
                p.Workout?.ThumbnailUrl,
                p.Workout?.DurationMin ?? 0,
                p.ProgressPct,
                p.LastWatchedAt
            ));
        }
    }
}
