using EliteFit.Application.DTOs.Personalization;
using EliteFit.Domain.Interfaces.Repositories.Personalization;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Personalization.Query
{
    public class GetSmartRecipesQueryHandler : IRequestHandler<GetSmartRecipesQuery, List<SmartRecipeDto>>
    {
        private readonly IUserProfileQueryRepository _userProfileRepository;
        private readonly IRecipesSmartQueryRepository _recipesSmartRepository;

        public GetSmartRecipesQueryHandler(
            IUserProfileQueryRepository userProfileRepository,
            IRecipesSmartQueryRepository recipesSmartRepository)
        {
            _userProfileRepository = userProfileRepository;
            _recipesSmartRepository = recipesSmartRepository;
        }

        public async Task<List<SmartRecipeDto>> Handle(GetSmartRecipesQuery request, CancellationToken cancellationToken)
        {
            if (request.UserId <= 0)
            {
                throw new ArgumentException("Id e përdoruesit duhet të jetë më e madhe se zero.");
            }

            var userAllergyIds = await _userProfileRepository.GetUserAllergyIdsAsync(request.UserId, cancellationToken);

            var recipes = await _recipesSmartRepository.GetSafeRecipesAsync(
                userAllergyIds,
                request.MaxCalories,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            // Mapimi i rregulluar me trajtimin e vlerave null (??) dhe pa Description
            return recipes.Select(r => new SmartRecipeDto
            {
                Id = r.Id,
                Title = r.Title,
                Calories = r.Calories ?? 0,       // Zgjidh errorin e int? në int
                Protein = r.ProteinG ?? 0m,       // Zgjidh errorin e decimal? në decimal
                Carbs = r.CarbsG ?? 0m,           // Zgjidh errorin e decimal? në decimal
                Fat = r.FatG ?? 0m                // Zgjidh errorin e decimal? në decimal
            }).ToList();
        }
    }
}