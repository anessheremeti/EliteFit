using EliteFit.Application.DTOs.Exercise;
using MediatR;

namespace EliteFit.Application.Features.Exercise.Queries.GetExerciseCategoryById
{
    public record GetExerciseCategoryByIdQuery(int Id) : IRequest<ExerciseCategoryDto>;
}