using System.Collections.Generic;
using EliteFit.Application.DTOs.Exercise;
using MediatR;

namespace EliteFit.Application.Features.Exercise.Queries.GetExerciseCategories
{
    public record GetExerciseCategoriesQuery : IRequest<List<ExerciseCategoryDto>>;
}