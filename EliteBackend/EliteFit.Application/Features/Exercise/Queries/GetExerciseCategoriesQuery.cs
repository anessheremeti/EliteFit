using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Repositories.Exercise;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Exercise.Queries
{
    public record GetExerciseCategoriesQuery : IRequest<List<ExerciseCategory>>;

    public class GetExerciseCategoriesQueryHandler : IRequestHandler<GetExerciseCategoriesQuery, List<ExerciseCategory>>
    {
        private readonly IExerciseCategoryRepository _repository;

        public GetExerciseCategoriesQueryHandler(IExerciseCategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ExerciseCategory>> Handle(GetExerciseCategoriesQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetAllAsync(cancellationToken);
        }
    }
}