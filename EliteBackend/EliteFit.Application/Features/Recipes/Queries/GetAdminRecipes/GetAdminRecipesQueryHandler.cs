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
            // SHËNIM: Sigurohu që brenda 'GetAllForAdminAsync' ke bërë .Include(r => r.ImageFile) 
            // në mënyrë që të marrim rrugën (Path) e fotos nga databaza pa dalë null.
            var recipes = await _recipeRepository.GetAllForAdminAsync(
                request.SearchTerm,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            return recipes.Select(r => new AdminRecipeDto
            {
                Id = r.Id,
                Title = r.Title,        // E mbajtur për prapakompatibilitet (nëse përdorej diku tjetër)
                Instructions = r.Instructions, // Tani forma do të mbushet me tekstin e vjetër
                Calories = r.Calories,
                ProteinG = r.ProteinG,
                CarbsG = r.CarbsG,     // E shtuar
                FatG = r.FatG,         // E shtuar
                ImageFileId = r.ImageFileId, // E shtuar (Për të treguar ID-në e fotos në Edit)

                // Marrja e rrugës së fotos për ta shfaqur në listën e React
                // (Zëvendëso 'ImageFile' me emrin e saktë që ke vendosur në entitetin Recipe)
                ImagePath = r.ImageFile != null ? r.ImageFile.FilePath : null,

                AllergenIds = r.Allergens != null ? r.Allergens.Select(a => a.AllergyId).ToList() : new List<int>()
            }).ToList();
        }
    }
}