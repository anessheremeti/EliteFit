using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using MediatR;

namespace EliteFit.Application.Features.Workouts.Commands
{
    public record CompleteWorkoutVideoCommand : IRequest<bool>
    {
        public int UserId { get; set; }
        public int VideoId { get; set; }
        public int? CaloriesBurned { get; set; }
        public int? TimeWatchedSeconds { get; init; }
    }
    public class CompleteWorkoutVideoCommandHandler : IRequestHandler<CompleteWorkoutVideoCommand, bool>
    {
        private readonly IWorkoutVideoRepository _workoutVideoRepository;
        public CompleteWorkoutVideoCommandHandler(IWorkoutVideoRepository workoutVideoRepository)
        {
            _workoutVideoRepository = workoutVideoRepository;

        }
        public async Task<bool> Handle(CompleteWorkoutVideoCommand command, CancellationToken cancellationToken)
        {
            var video = await _workoutVideoRepository.GetByIdAsync(command.VideoId, cancellationToken);
            if (video == null) {
                return false;
            }


            //Llogaritja dinamike e kalorive bazuar në kohën e shikimit
            int? calculatedCalories = command.CaloriesBurned;

            if (calculatedCalories == null)
            {
                if (command.TimeWatchedSeconds.HasValue &&
                    video.DurationSeconds.HasValue && 
                    video.DurationSeconds.Value > 0 &&
                    video.EstimatedCaloriesBurned.HasValue)
                // Formula e përpjesëtimit: (Koha e shikuar / Koha totale) * Kaloritë e parandaluara
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
                CaloriesBurned = command.CaloriesBurned,
                TimeWatchedSeconds = command.TimeWatchedSeconds,
                CompletedAt = DateTime.UtcNow
            };

            await _workoutVideoRepository.AddHistoryAsync(history, cancellationToken);
            return true;
        }

    } }


