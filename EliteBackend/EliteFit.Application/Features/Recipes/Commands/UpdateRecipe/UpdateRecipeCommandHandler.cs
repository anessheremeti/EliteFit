using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using EliteFit.Domain.Entities;

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
            // 1. Gjej recetën ekzistuese
            var recipe = await _recipeRepository.GetByIdAsync(request.Id, cancellationToken);

            if (recipe == null)
            {
                throw new KeyNotFoundException($"Receta me ID {request.Id} nuk ekziston.");
            }

            // 2. Përditëso fushat bazë
            recipe.Title = request.Title;
            recipe.Instructions = request.Instructions;
            recipe.Calories = request.Calories;
            recipe.ProteinG = request.ProteinG;
            recipe.CarbsG = request.CarbsG;
            recipe.FatG = request.FatG;

            // ==========================================================
            // RREGULLIMI KRYESOR: 
            // Përditësoje ImageFileId VETËM nëse ka ardhur një ID e re.
            // Nëse vjen null, lëre ashtu siç ishte (mos e fshi foton).
            // ==========================================================
            if (request.ImageFileId != null && request.ImageFileId != 0)
            {
                recipe.ImageFileId = request.ImageFileId;
            }

            // 3. Integriteti i alergjenëve
            if (recipe.Allergens != null)
            {
                recipe.Allergens.Clear();
            }
            else
            {
                recipe.Allergens = new List<RecipeAllergenInfo>();
            }

            if (request.AllergenIds != null && request.AllergenIds.Any())
            {
                var newAllergens = request.AllergenIds.Select(id => new RecipeAllergenInfo
                {
                    RecipeId = recipe.Id,
                    AllergyId = id
                });

                foreach (var item in newAllergens)
                {
                    recipe.Allergens.Add(item);
                }
            }

            // 4. Ruaj ndryshimet
            await _recipeRepository.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}