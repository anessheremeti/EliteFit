using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Interfaces.Repositories.Exercise;
using MediatR;

namespace EliteFit.Application.Features.Exercise.Commands
{
    public record DeleteExerciseCategoryCommand(int Id) : IRequest<bool>;

    public class DeleteExerciseCategoryCommandHandler : IRequestHandler<DeleteExerciseCategoryCommand, bool>
    {
        private readonly IExerciseCategoryRepository _repository;

        public DeleteExerciseCategoryCommandHandler(IExerciseCategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(DeleteExerciseCategoryCommand command, CancellationToken cancellationToken)
        {
            var category = await _repository.GetByIdAsync(command.Id, cancellationToken);
            if (category == null) return false;

            await _repository.DeleteAsync(category, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
