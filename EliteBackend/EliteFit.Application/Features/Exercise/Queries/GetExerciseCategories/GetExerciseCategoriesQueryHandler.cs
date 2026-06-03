using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Exercise;
using EliteFit.Domain.Interfaces.Repositories.Exercise;
using MediatR;

namespace EliteFit.Application.Features.Exercise.Queries.GetExerciseCategories
{
    public class GetExerciseCategoriesQueryHandler : IRequestHandler<GetExerciseCategoriesQuery, List<ExerciseCategoryDto>>
    {
        private readonly IExerciseCategoryRepository _repository;

        public GetExerciseCategoriesQueryHandler(IExerciseCategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ExerciseCategoryDto>> Handle(GetExerciseCategoriesQuery request, CancellationToken cancellationToken)
        {
            var categories = await _repository.GetAllAsync(cancellationToken);

            // Mapimi i pastër i entiteteve në DTOs
            return categories.Select(c => new ExerciseCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            }).ToList();
        }
    }
}