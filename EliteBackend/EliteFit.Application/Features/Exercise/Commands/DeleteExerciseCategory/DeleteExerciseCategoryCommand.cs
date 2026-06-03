using MediatR;

namespace EliteFit.Application.Features.Exercise.Commands.DeleteExerciseCategory
{
    public record DeleteExerciseCategoryCommand(int Id) : IRequest<bool>;
}