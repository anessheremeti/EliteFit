using EliteFit.Application.DTOs.Workouts; // Shto këtë import
using MediatR;

namespace EliteFit.Application.Features.Workouts.Commands.CompleteWorkoutVideo
{
    // Këtu ndryshohet nga <bool> në <WorkoutCompletionResultDto>
    public class CompleteWorkoutVideoCommand : IRequest<WorkoutCompletionResultDto>
    {
        public int UserId { get; set; }
        public int VideoId { get; set; }
        public int? CaloriesBurned { get; set; }
        public int? TimeWatchedSeconds { get; init; }
    }
}