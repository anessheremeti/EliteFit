using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Workout
{
    public record GetWorkoutCategoriesQuery : IRequest<IEnumerable<string>>;

    public class GetWorkoutCategoriesQueryHandler : IRequestHandler<GetWorkoutCategoriesQuery, IEnumerable<string>>
    {
        private readonly IWorkoutRepository _repo;
        public GetWorkoutCategoriesQueryHandler(IWorkoutRepository repo) => _repo = repo;

        public async Task<IEnumerable<string>> Handle(GetWorkoutCategoriesQuery req, CancellationToken ct)
            => await _repo.GetCategoriesAsync();
    }
}
