using MediatR;

namespace EliteFit.Application.Features.Exercise.Commands.UpdateExerciseCategory
{
    public record UpdateExerciseCategoryCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}