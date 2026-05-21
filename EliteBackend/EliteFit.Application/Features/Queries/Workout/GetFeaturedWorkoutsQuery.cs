using EliteFit.Application.DTOs.Workout;
using EliteFit.Application.Features.Queries.Workout;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Workout
{
    public record GetFeaturedWorkoutsQuery(int Count = 3, string BaseUrl = "") : IRequest<IEnumerable<WorkoutDto>>;

    public class GetFeaturedWorkoutsQueryHandler : IRequestHandler<GetFeaturedWorkoutsQuery, IEnumerable<WorkoutDto>>
    {
        private static readonly string[] Labels = ["Featured Workout", "Most Popular", "New Release"];

        private readonly IWorkoutRepository _repo;
        public GetFeaturedWorkoutsQueryHandler(IWorkoutRepository repo) => _repo = repo;

        public async Task<IEnumerable<WorkoutDto>> Handle(GetFeaturedWorkoutsQuery req, CancellationToken ct)
        {
            var featured = (await _repo.GetFeaturedAsync(req.Count)).ToList();
            return featured.Select((w, i) => GetWorkoutsQueryHandler.Map(w, req.BaseUrl, Labels[Math.Min(i, Labels.Length - 1)]));
        }
    }
}
