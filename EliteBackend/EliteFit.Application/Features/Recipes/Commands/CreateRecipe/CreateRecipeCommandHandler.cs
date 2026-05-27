using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.CreateRecipe
{
    public class CreateRecipeCommandHandler : IRequestHandler<CreateRecipeCommand, int>
    {
        private readonly IRecipeAdminRepository _recipeRepository;

        public CreateRecipeCommandHandler(IRecipeAdminRepository recipeRepository)
        {
            _recipeRepository = recipeRepository;
        }

        public async Task<int> Handle(CreateRecipeCommand request, CancellationToken cancellationToken)
        {
            var recipe = new Recipe
            {
                Title = request.Title,
                Instructions = request.Instructions,
                Calories = request.Calories,
                ProteinG = request.ProteinG,
                CarbsG = request.CarbsG,
                FatG = request.FatG,
                ImageFileId = request.ImageFileId,
                Allergens = request.AllergenIds.Select(id => new RecipeAllergenInfo
                {
                    AllergyId = id
                }).ToList()
            };

            await _recipeRepository.AddAsync(recipe, cancellationToken);
            await _recipeRepository.SaveChangesAsync(cancellationToken);

            return recipe.Id;
        }
    }
}
