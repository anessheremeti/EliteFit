using EliteFit.Application.Features.Commands.ExerciseLog;
using FluentValidation;

namespace EliteFit.Application.Validators
{
    public class LogExerciseValidator : AbstractValidator<LogExerciseCommand>
    {
        public LogExerciseValidator()
        {
            // When no video library ID is supplied, the caller must name the exercise
            RuleFor(x => x.Request.ExerciseName)
                .NotEmpty()
                .When(x => !x.Request.ExerciseId.HasValue)
                .WithMessage("ExerciseName is required when ExerciseId is not provided.");

            RuleFor(x => x.Request.ExerciseName)
                .MaximumLength(200)
                .When(x => !string.IsNullOrEmpty(x.Request.ExerciseName))
                .WithMessage("ExerciseName cannot exceed 200 characters.");

            RuleFor(x => x.Request.BodyPart)
                .MaximumLength(100)
                .When(x => x.Request.BodyPart != null)
                .WithMessage("BodyPart cannot exceed 100 characters.");

            RuleFor(x => x.Request.CaloriesBurned)
                .GreaterThan(0)
                .When(x => x.Request.CaloriesBurned.HasValue)
                .WithMessage("CaloriesBurned must be greater than zero.");

            RuleFor(x => x.Request.DurationSeconds)
                .GreaterThan(0)
                .When(x => x.Request.DurationSeconds.HasValue)
                .WithMessage("DurationSeconds must be greater than zero.");

            // Allow up to 5 minutes of clock skew between client and server
            RuleFor(x => x.Request.CompletedAt)
                .LessThanOrEqualTo(_ => DateTime.UtcNow.AddMinutes(5))
                .When(x => x.Request.CompletedAt.HasValue)
                .WithMessage("CompletedAt cannot be in the future.");

            RuleFor(x => x.Request.Notes)
                .MaximumLength(500)
                .When(x => x.Request.Notes != null)
                .WithMessage("Notes cannot exceed 500 characters.");
        }
    }
}
