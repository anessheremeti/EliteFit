using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.DeleteRecipe
{
    public class DeleteRecipeCommandHandler : IRequestHandler<DeleteRecipeCommand, Unit>
    {
        private readonly IRecipeAdminRepository _recipeRepository;

        public DeleteRecipeCommandHandler(IRecipeAdminRepository recipeRepository)
        {
            _recipeRepository = recipeRepository;
        }

        public async Task<Unit> Handle(DeleteRecipeCommand request, CancellationToken cancellationToken)
        {
            var recipe = await _recipeRepository.GetByIdAsync(request.Id, cancellationToken);

            if (recipe == null)
            {
                throw new KeyNotFoundException($"Receta me ID {request.Id} nuk u gjet.");
            }

            _recipeRepository.Delete(recipe);
            await _recipeRepository.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
