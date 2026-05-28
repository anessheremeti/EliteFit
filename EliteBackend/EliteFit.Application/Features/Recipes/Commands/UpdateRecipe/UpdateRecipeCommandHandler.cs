using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.UpdateRecipe
{
    public class UpdateRecipeCommandHandler : IRequestHandler<UpdateRecipeCommand, Unit>
    {
        private readonly IRecipeAdminRepository _recipeRepository;

        public UpdateRecipeCommandHandler(IRecipeAdminRepository recipeRepository)
        {
            _recipeRepository = recipeRepository;
        }

        public async Task<Unit> Handle(UpdateRecipeCommand request, CancellationToken cancellationToken)
        {
            var recipe = await _recipeRepository.GetByIdAsync(request.Id, cancellationToken);

            if (recipe == null)
            {
                throw new KeyNotFoundException($"Receta me ID {request.Id} nuk ekziston.");
            }

            recipe.Title = request.Title;
            recipe.Instructions = request.Instructions;
            recipe.Calories = request.Calories;
            recipe.ProteinG = request.ProteinG;

            // Integriteti i të dhënave: Fshijmë alergjenët e vjetër dhe vendosim të rinjtë
            recipe.Allergens.Clear();
            recipe.Allergens = request.AllergenIds.Select(id => new RecipeAllergenInfo
            {
                RecipeId = recipe.Id,
                AllergyId = id
            }).ToList();

            _recipeRepository.Update(recipe);
            await _recipeRepository.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
