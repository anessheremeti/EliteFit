using EliteFit.Application.DTOs.Workouts;
using MediatR;

namespace EliteFit.Application.Features.Workouts.Queries.GetWorkoutVideoById
{
    public class GetWorkoutVideoByIdQuery : IRequest<WorkoutVideoDto>
    {
        public int Id { get; set; }

        public GetWorkoutVideoByIdQuery(int id)
        {
            Id = id;
        }
    }
}