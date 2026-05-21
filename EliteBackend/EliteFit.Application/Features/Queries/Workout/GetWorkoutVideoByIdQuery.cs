using EliteFit.Application.DTOs.Workout;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Workout
{
    public record GetWorkoutVideoByIdQuery(int Id, string BaseUrl) : IRequest<WorkoutVideoDto?>;

    public class GetWorkoutVideoByIdQueryHandler : IRequestHandler<GetWorkoutVideoByIdQuery, WorkoutVideoDto?>
    {
        private readonly IWorkoutVideoRepository _repo;
        public GetWorkoutVideoByIdQueryHandler(IWorkoutVideoRepository repo) => _repo = repo;

        public async Task<WorkoutVideoDto?> Handle(GetWorkoutVideoByIdQuery req, CancellationToken ct)
        {
            var v = await _repo.GetByIdAsync(req.Id);
            return v is null ? null : GetWorkoutVideosQueryHandler.Map(v, req.BaseUrl);
        }
    }
}
