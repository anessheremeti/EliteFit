using MediatR;

namespace EliteFit.Application.Features.Workouts.Commands.CompleteWorkoutVideo
{
    public record CompleteWorkoutVideoCommand : IRequest<bool>
    {
        public int UserId { get; set; }
        public int VideoId { get; set; }
        public int? CaloriesBurned { get; set; }
        public int? TimeWatchedSeconds { get; init; }
    }
}
