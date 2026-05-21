using EliteFit.Application.DTOs.ExerciseLog;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.ExerciseLog
{
    public record GetExerciseSummaryQuery(int UserId) : IRequest<ExerciseSummaryDto>;

    public class GetExerciseSummaryQueryHandler
        : IRequestHandler<GetExerciseSummaryQuery, ExerciseSummaryDto>
    {
        private readonly IExerciseLogRepository _repo;
        public GetExerciseSummaryQueryHandler(IExerciseLogRepository repo) => _repo = repo;

        public async Task<ExerciseSummaryDto> Handle(
            GetExerciseSummaryQuery req, CancellationToken ct)
        {
            var bodyPartRows = (await _repo.GetBodyPartSummaryAsync(req.UserId)).ToList();

            var stats = bodyPartRows
                .Select(r => new BodyPartStat(r.BodyPart, r.TotalCalories, r.TotalSeconds, r.SessionCount))
                .OrderByDescending(s => s.SessionCount)
                .ToList();

            return new ExerciseSummaryDto(
                TotalSessions  : stats.Sum(s => s.SessionCount),
                TotalCalories  : stats.Sum(s => s.TotalCalories),
                TotalSeconds   : stats.Sum(s => s.TotalSeconds),
                ByBodyPart     : stats
            );
        }
    }
}
