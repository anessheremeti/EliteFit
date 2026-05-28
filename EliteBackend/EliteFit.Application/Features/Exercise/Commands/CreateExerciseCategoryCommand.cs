using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Exercise;
using MediatR;

namespace EliteFit.Application.Features.Exercise.Commands
{
  
    public record CreateExerciseCategoryCommand :IRequest<int>
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; }=string.Empty;
    }

    public class CreateExerciseCategoryCommandHandler : IRequestHandler<CreateExerciseCategoryCommand, int>
    {
        private readonly IExerciseCategoryRepository _repository;   

        public CreateExerciseCategoryCommandHandler (IExerciseCategoryRepository repository)
        {
            _repository = repository;
        }
        public async Task<int> Handle(CreateExerciseCategoryCommand command, CancellationToken cancellationToken)
        {
            var category = new ExerciseCategory
            {
                Name = command.Name,
                Description = command.Description,
            };
            await _repository.AddAsync(category, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            return category.Id;
        }
    }
}
