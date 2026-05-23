using EliteFit.Application.DTOs.ExerciseLog;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Commands.ExerciseLog
{
    public record LogExerciseCommand(int UserId, CreateExerciseLogRequest Request)
        : IRequest<ExerciseLogDto>;

    public class LogExerciseCommandHandler : IRequestHandler<LogExerciseCommand, ExerciseLogDto>
    {
        private readonly IExerciseLogRepository _logRepo;
        private readonly IWorkoutVideoRepository _videoRepo;

        public LogExerciseCommandHandler(
            IExerciseLogRepository logRepo,
            IWorkoutVideoRepository videoRepo)
        {
            _logRepo   = logRepo;
            _videoRepo = videoRepo;
        }

        public async Task<ExerciseLogDto> Handle(LogExerciseCommand cmd, CancellationToken ct)
        {
            var req = cmd.Request;

            // Auto-populate denormalized fields when the caller provides an ExerciseId
            string exerciseName = req.ExerciseName ?? string.Empty;
            string? bodyPart    = req.BodyPart;

            if (req.ExerciseId.HasValue)
            {
                var video = await _videoRepo.GetByIdAsync(req.ExerciseId.Value);
                if (video is not null)
                {
                    if (string.IsNullOrWhiteSpace(exerciseName))
                        exerciseName = video.ExerciseName;
                    bodyPart ??= video.MuscleGroup;
                }
            }

            var log = new Domain.Entities.ExerciseLog
            {
                UserId          = cmd.UserId,
                ExerciseId      = req.ExerciseId,
                ExerciseName    = exerciseName,
                BodyPart        = bodyPart,
                WorkoutId       = req.WorkoutId,
                CaloriesBurned  = req.CaloriesBurned,
                DurationSeconds = req.DurationSeconds,
                CompletedAt     = req.CompletedAt ?? DateTime.UtcNow,
                Notes           = req.Notes,
                CreatedAt       = DateTime.UtcNow,
            };

            await _logRepo.AddAsync(log);
            await _logRepo.SaveChangesAsync();

            return Map(log);
        }

        internal static ExerciseLogDto Map(Domain.Entities.ExerciseLog l) => new(
            l.Id, l.ExerciseId, l.ExerciseName, l.BodyPart, l.WorkoutId,
            l.CaloriesBurned, l.DurationSeconds, l.CompletedAt, l.Notes, l.CreatedAt);
    }
}
