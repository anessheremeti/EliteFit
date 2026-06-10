using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Workouts; // Shto këtë import
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using MediatR;

namespace EliteFit.Application.Features.Workouts.Commands.CompleteWorkoutVideo
{
    // 1. NDRYSHIMI KËTU: Nga <..., bool> në <..., WorkoutCompletionResultDto>
    public class CompleteWorkoutVideoCommandHandler : IRequestHandler<CompleteWorkoutVideoCommand, WorkoutCompletionResultDto>
    {
        private readonly IWorkoutVideoRepository _workoutVideoRepository;

        public CompleteWorkoutVideoCommandHandler(IWorkoutVideoRepository workoutVideoRepository)
        {
            _workoutVideoRepository = workoutVideoRepository;
        }

        // 2. NDRYSHIMI KËTU: Task<bool> bëhet Task<WorkoutCompletionResultDto>
        public async Task<WorkoutCompletionResultDto> Handle(CompleteWorkoutVideoCommand command, CancellationToken cancellationToken)
        {
            var video = await _workoutVideoRepository.GetByIdAsync(command.VideoId, cancellationToken);
            if (video == null)
            {
                return null; // Ose throw new NotFoundException() varësisht si e ke arkitekturën
            }

            // Logjika jote e shkëlqyer e kalorive mbetet e njëjtë...
            int? calculatedCalories = command.CaloriesBurned;

            if (calculatedCalories == null)
            {
                if (command.TimeWatchedSeconds.HasValue &&
                    video.DurationSeconds.HasValue &&
                    video.DurationSeconds.Value > 0 &&
                    video.EstimatedCaloriesBurned.HasValue)
                {
                    double progressRatio = (double)command.TimeWatchedSeconds.Value / video.DurationSeconds.Value;
                    if (progressRatio > 1.0) progressRatio = 1.0;

                    calculatedCalories = (int)Math.Round(progressRatio * video.EstimatedCaloriesBurned.Value);
                }
                else
                {
                    calculatedCalories = video.EstimatedCaloriesBurned;
                }
            }

            var history = new UserWorkoutHistory
            {
                UserId = command.UserId,
                VideoId = command.VideoId,
                CaloriesBurned = calculatedCalories,
                TimeWatchedSeconds = command.TimeWatchedSeconds,
                CompletedAt = DateTime.UtcNow
            };

            await _workoutVideoRepository.AddHistoryAsync(history, cancellationToken);

            // 3. NDRYSHIMI KËTU: Në vend të "return true", paketojmë dhuratën për Frontend-in
            return new WorkoutCompletionResultDto
            {
                CaloriesBurned = calculatedCalories ?? 0,

                // Për momentin po i kthejmë statike (Hardcoded). Pasi të ndërtosh 
                // Gamification Repository, këto do t'i marrësh në mënyrë dinamike.
                CurrentStreak = 1,
                NewBadges = new List<BadgeRewardDto>()
            };
        }
    }
}