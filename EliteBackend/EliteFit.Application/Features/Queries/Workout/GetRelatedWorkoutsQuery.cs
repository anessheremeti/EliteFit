using EliteFit.Application.DTOs.Workout;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Workout
{
    public record GetRelatedWorkoutsQuery(int WorkoutId, string? Category, int Limit = 4, string BaseUrl = "")
        : IRequest<IEnumerable<WorkoutDto>>;

    public class GetRelatedWorkoutsQueryHandler : IRequestHandler<GetRelatedWorkoutsQuery, IEnumerable<WorkoutDto>>
    {
        private readonly IWorkoutRepository _repo;
        public GetRelatedWorkoutsQueryHandler(IWorkoutRepository repo) => _repo = repo;

        public async Task<IEnumerable<WorkoutDto>> Handle(GetRelatedWorkoutsQuery req, CancellationToken ct)
        {
            var workouts = await _repo.GetRelatedAsync(req.WorkoutId, req.Category, req.Limit);
            return workouts.Select(w => GetWorkoutsQueryHandler.Map(w, req.BaseUrl));
        }
    }
}
