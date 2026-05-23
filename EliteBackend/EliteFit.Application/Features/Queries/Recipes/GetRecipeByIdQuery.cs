using System.Text.Json;
using EliteFit.Application.DTOs.Recipes;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Recipes
{
    public record GetRecipeByIdQuery(int Id) : IRequest<RecipeDetailDto?>;

    public class GetRecipeByIdQueryHandler : IRequestHandler<GetRecipeByIdQuery, RecipeDetailDto?>
    {
        private readonly IRecipeRepository _repo;
        public GetRecipeByIdQueryHandler(IRecipeRepository repo) => _repo = repo;

        public async Task<RecipeDetailDto?> Handle(GetRecipeByIdQuery req, CancellationToken ct)
        {
            var recipe = await _repo.GetByIdAsync(req.Id);
            return recipe is null ? null : MapDetail(recipe);
        }

        private static readonly JsonSerializerOptions _json = new() { PropertyNameCaseInsensitive = true };

        internal static RecipeDetailDto MapDetail(Domain.Entities.Recipe r)
        {
            var ingredients = ParseIngredients(r.IngredientsJson);
            var steps       = ParseSteps(r.StepsJson);
            var allergens   = r.Allergens.Select(a => a.Allergy?.Name ?? "").Where(n => n.Length > 0);

            return new RecipeDetailDto(
                r.Id, r.Title, r.Description, r.Category, r.DietType, r.DifficultyLevel,
                r.Calories, r.ProteinG, r.CarbsG, r.FatG,
                r.PrepTimeMin, r.CookTimeMin, r.ServingsCount,
                r.ImageUrl, r.IsFeatured,
                allergens, ingredients, steps
            );
        }

        private static IEnumerable<IngredientDto> ParseIngredients(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return [];
            try { return JsonSerializer.Deserialize<List<IngredientDto>>(json, _json) ?? []; }
            catch { return []; }
        }

        private static IEnumerable<string> ParseSteps(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return [];
            try { return JsonSerializer.Deserialize<List<string>>(json, _json) ?? []; }
            catch { return []; }
        }
    }
}
