using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Domain.Interfaces.Repositories.Exercise;
using MediatR;

namespace EliteFit.Application.Features.Exercise.Commands
{
    public record UpdateExerciseCategoryCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Name {  get; set; }=string.Empty;
        public string Description { get; set; } = string.Empty;

    }
    public  class UpdateExerciseCategoryCommandHandler : IRequestHandler<UpdateExerciseCategoryCommand, bool>
    {
        private readonly IExerciseCategoryRepository _repository;

        public UpdateExerciseCategoryCommandHandler(IExerciseCategoryRepository repository)
        {
            _repository = repository;
        }
        public async Task<bool> Handle(UpdateExerciseCategoryCommand command, CancellationToken cancellationToken)
        {
            var category = await _repository.GetByIdAsync(command.Id, cancellationToken);
            if (category == null) return false;

            category.Name = command.Name;
            category.Description = command.Description;

            await _repository.UpdateAsync(category, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
    
    }

