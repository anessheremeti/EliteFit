using EliteFit.Application.DTOs.Workouts;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace EliteFit.Application.Features.Workouts.Queries.GetContinueWatching
{
    public class GetContinueWatchingQueryHandler : IRequestHandler<GetContinueWatchingQuery, List<ContinueWatchingDto>>
    {
        private readonly IWorkoutVideoRepository _repository;

        public GetContinueWatchingQueryHandler(IWorkoutVideoRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ContinueWatchingDto>> Handle(GetContinueWatchingQuery request, CancellationToken cancellationToken)
        {
            // Marrim historikun e përdoruesit (këtu supozojmë se repository e ka një metodë të tillë)
            var histories = await _repository.GetUserHistoryAsync(request.UserId, cancellationToken);

            return histories.Select(h => new ContinueWatchingDto
            {
                ProgressId = h.Id,
                Title = h.Video.Title,
                DurationMin = (h.Video.DurationSeconds ?? 0) / 60,
                // Llogaritja e progresit në përqindje
                ProgressPct = (h.TimeWatchedSeconds.HasValue && h.Video.DurationSeconds > 0)
                    ? (int)((double)h.TimeWatchedSeconds.Value / h.Video.DurationSeconds.Value * 100)
                    : 0
            }).ToList();
        }
    }
}