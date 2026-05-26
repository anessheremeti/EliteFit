using EliteFit.Application.Features.Workouts.Commands;
using FluentValidation;

namespace EliteFit.Application.Validators
{
    public class CreateWorkoutVideoValidator : AbstractValidator<CreateWorkoutVideoCommand>
    {
        public CreateWorkoutVideoValidator()
        {
            RuleFor(v => v.Title)
                .NotEmpty().WithMessage("Titulli i videos është i detyrueshëm.")
                .MaximumLength(150).WithMessage("Titulli nuk mund të jetë më i gjatë se 150 karaktere.");

            RuleFor(v => v.DifficultyLevel)
                .NotEmpty().WithMessage("Niveli i vështirësisë është i detyrueshëm.");

            RuleFor(v => v.DurationSeconds)
                .GreaterThan(0).When(v => v.DurationSeconds.HasValue)
                .WithMessage("Kohëzgjatja duhet të jetë më e madhe se 0 sekonda.");
        }
    }
}
