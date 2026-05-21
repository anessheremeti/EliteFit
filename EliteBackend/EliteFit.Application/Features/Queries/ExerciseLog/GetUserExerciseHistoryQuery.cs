using EliteFit.Application.DTOs.ExerciseLog;
using EliteFit.Application.Features.Commands.ExerciseLog;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.ExerciseLog
{
    public record GetUserExerciseHistoryQuery(int UserId, int Page = 1, int PageSize = 20)
        : IRequest<PagedResult<ExerciseLogDto>>;

    public class GetUserExerciseHistoryQueryHandler
        : IRequestHandler<GetUserExerciseHistoryQuery, PagedResult<ExerciseLogDto>>
    {
        private readonly IExerciseLogRepository _repo;
        public GetUserExerciseHistoryQueryHandler(IExerciseLogRepository repo) => _repo = repo;

        public async Task<PagedResult<ExerciseLogDto>> Handle(
            GetUserExerciseHistoryQuery req, CancellationToken ct)
        {
            var (items, total) = await _repo.GetByUserIdAsync(
                req.UserId, req.Page, req.PageSize);

            return new PagedResult<ExerciseLogDto>(
                items.Select(LogExerciseCommandHandler.Map),
                total, req.Page, req.PageSize);
        }
    }
}
