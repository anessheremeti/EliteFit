using EliteFit.Application.DTOs.Workouts;
using EliteFit.Application.Features.Workouts.Commands.CompleteWorkoutVideo;
using EliteFit.Domain.Interfaces.Services;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using MediatR;

public class CompleteWorkoutVideoCommandHandler
    : IRequestHandler<CompleteWorkoutVideoCommand, WorkoutCompletionResultDto>
{
    private readonly IWorkoutVideoRepository _workoutVideoRepository;
    private readonly INotificationService _notificationService;

    public CompleteWorkoutVideoCommandHandler(
        IWorkoutVideoRepository workoutVideoRepository,
        INotificationService notificationService)
    {
        _workoutVideoRepository = workoutVideoRepository;
        _notificationService = notificationService;
    }

    public async Task<WorkoutCompletionResultDto> Handle(
        CompleteWorkoutVideoCommand command,
        CancellationToken cancellationToken)
    {
        var video = await _workoutVideoRepository.GetByIdAsync(command.VideoId, cancellationToken);
        if (video == null)
            return null;

        int? calculatedCalories = command.CaloriesBurned;
        if (calculatedCalories == null && video.DurationSeconds.HasValue && video.EstimatedCaloriesBurned.HasValue)
        {
            double ratio = (double)(command.TimeWatchedSeconds ?? 0) / video.DurationSeconds.Value;
            if (ratio > 1.0) ratio = 1.0;
            calculatedCalories = (int)Math.Round(ratio * video.EstimatedCaloriesBurned.Value);
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

        // 🟢 Dërgo njoftimin real-time përmes NotificationService
        await _notificationService.SendNotificationAsync(
            command.UserId,
            "Workout Completed 💪",
            $"Urime! Përfundove stërvitjen \"{video.Title}\" dhe dogje {calculatedCalories} kcal."
        );

        return new WorkoutCompletionResultDto
        {
            CaloriesBurned = calculatedCalories ?? 0,
            CurrentStreak = 1,
            NewBadges = new List<BadgeRewardDto>()
        };
    }
}
