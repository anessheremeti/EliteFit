using MediatR;

namespace EliteFit.Application.Features.Exercise.Commands.CreateExerciseCategory
{
    public record CreateExerciseCategoryCommand : IRequest<int>
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}