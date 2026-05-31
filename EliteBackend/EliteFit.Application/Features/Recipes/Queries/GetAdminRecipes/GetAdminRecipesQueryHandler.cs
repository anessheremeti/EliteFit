using EliteFit.Application.DTOs.Recipes.command;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Queries.GetAdminRecipes
{
    public class GetAdminRecipesQueryHandler : IRequestHandler<GetAdminRecipesQuery, List<AdminRecipeDto>>
    {
        private readonly IRecipeAdminRepository _recipeRepository;

        public GetAdminRecipesQueryHandler(IRecipeAdminRepository recipeRepository)
        {
            _recipeRepository = recipeRepository;
        }

        public async Task<List<AdminRecipeDto>> Handle(GetAdminRecipesQuery request, CancellationToken cancellationToken)
        {
            // Kalojmë filtrat dhe paginimin direkt tek metoda e repozitorit
            var recipes = await _recipeRepository.GetAllForAdminAsync(
                request.SearchTerm,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            return recipes.Select(r => new AdminRecipeDto
            {
                Id = r.Id,
                Name = r.Title,
                Calories = r.Calories,
                ProteinG = r.ProteinG,
                AllergenIds = r.Allergens.Select(a => a.AllergyId).ToList()
            }).ToList();
        }
    }
}
