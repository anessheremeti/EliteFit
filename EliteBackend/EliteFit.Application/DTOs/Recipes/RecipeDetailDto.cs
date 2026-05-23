namespace EliteFit.Application.DTOs.Recipes
{
    public record RecipeDetailDto(
        int Id,
        string Title,
        string? Description,
        string? Category,
        string? DietType,
        string? DifficultyLevel,
        int? Calories,
        decimal? ProteinG,
        decimal? CarbsG,
        decimal? FatG,
        int? PrepTimeMin,
        int? CookTimeMin,
        int? ServingsCount,
        string? ImageUrl,
        bool IsFeatured,
        IEnumerable<string> Allergens,
        IEnumerable<IngredientDto> Ingredients,
        IEnumerable<string> Steps
    );
}
