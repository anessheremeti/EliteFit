using EliteFit.Application.DTOs.ExerciseLog;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.ExerciseLog
{
    public record GetExerciseSessionStatsQuery(int UserId, int ExerciseId)
        : IRequest<ExerciseSessionStatsDto>;

    public class GetExerciseSessionStatsQueryHandler
        : IRequestHandler<GetExerciseSessionStatsQuery, ExerciseSessionStatsDto>
    {
        private readonly IExerciseLogRepository _repo;
        public GetExerciseSessionStatsQueryHandler(IExerciseLogRepository repo) => _repo = repo;

        public async Task<ExerciseSessionStatsDto> Handle(
            GetExerciseSessionStatsQuery req, CancellationToken ct)
        {
            var logs = (await _repo.GetByExerciseIdAsync(req.UserId, req.ExerciseId)).ToList();

            if (logs.Count == 0)
                return new ExerciseSessionStatsDto(0, 0, 0, null, null, null);

            return new ExerciseSessionStatsDto(
                TotalSessions       : logs.Count,
                TotalCalories       : logs.Sum(l => l.CaloriesBurned ?? 0),
                TotalSeconds        : logs.Sum(l => l.DurationSeconds ?? 0),
                LastCompletedAt     : logs.Max(l => l.CompletedAt ?? l.CreatedAt),
                BestDurationSeconds : logs.Max(l => (int?)l.DurationSeconds),
                BestCalories        : logs.Max(l => (int?)l.CaloriesBurned)
            );
        }
    }
}
