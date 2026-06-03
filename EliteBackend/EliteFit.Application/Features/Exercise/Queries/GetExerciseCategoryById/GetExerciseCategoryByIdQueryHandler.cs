using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Exercise;
using EliteFit.Domain.Interfaces.Repositories.Exercise;
using MediatR;

namespace EliteFit.Application.Features.Exercise.Queries.GetExerciseCategoryById
{
    public class GetExerciseCategoryByIdQueryHandler : IRequestHandler<GetExerciseCategoryByIdQuery, ExerciseCategoryDto>
    {
        private readonly IExerciseCategoryRepository _repository;

        public GetExerciseCategoryByIdQueryHandler(IExerciseCategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<ExerciseCategoryDto> Handle(GetExerciseCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            var category = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (category == null) return null;

            return new ExerciseCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
        }
    }
}