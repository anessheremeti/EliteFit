using EliteFit.Application.DTOs.Recipes.query;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Query;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Queries.GetUserRecipesList
{
    public class GetRecipesListQueryHandler : IRequestHandler<GetRecipesListQuery, List<RecipeListDto>>
    {
 
        private readonly IRecipesQueryRepositories _recipeRepository;

        public GetRecipesListQueryHandler(IRecipesQueryRepositories recipeRepository)
        {
            _recipeRepository = recipeRepository;
        }

        public async Task<List<RecipeListDto>> Handle(GetRecipesListQuery request, CancellationToken cancellationToken)
        {
            // 1. Marrim entitetet e pastra nga Domain Repository
            var recipes = await _recipeRepository.GetFilteredRecipesAsync(
                request.UserId, request.MaxCalories, request.MinProteinG, cancellationToken);

            // 2. Këtu bëjmë mapimin (Entitet -> DTO) pasi Application i sheh të dyja
            return recipes.Select(r => new RecipeListDto
            {
                Id = r.Id,
                Title = r.Title,
                Calories = r.Calories,
                ProteinG = r.ProteinG
            }).ToList();
        }
    }

}