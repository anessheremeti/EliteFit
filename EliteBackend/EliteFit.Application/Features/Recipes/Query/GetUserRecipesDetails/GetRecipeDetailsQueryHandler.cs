using EliteFit.Application.DTOs.Recipes.query;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Query;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Query.GetUserRecipesDetails
{
    public class GetRecipeDetailsQueryHandler : IRequestHandler<GetRecipeDetailsQuery, RecipeDetailsDto?>
    {
        private readonly IRecipesQueryRepositories _recipeRepository;

        public GetRecipeDetailsQueryHandler(IRecipesQueryRepositories recipeRepository)
        {
            _recipeRepository = recipeRepository;
        }

        public async Task<RecipeDetailsDto?> Handle(GetRecipeDetailsQuery request, CancellationToken cancellationToken)
        {
            var recipe = await _recipeRepository.GetRecipeByIdAsync(request.Id, cancellationToken);

            if (recipe == null) return null;

            // Mapimi për detajet e recetës (përfshirë instruksionet dhe të gjitha makrot)
            return new RecipeDetailsDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Instructions = recipe.Instructions,
                Calories = recipe.Calories,
                ProteinG = recipe.ProteinG,
                CarbsG = recipe.CarbsG,
                FatG = recipe.FatG
            };
        }
    }
}
