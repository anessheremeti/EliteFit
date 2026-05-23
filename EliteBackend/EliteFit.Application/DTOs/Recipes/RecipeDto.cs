namespace EliteFit.Application.DTOs.Recipes
{
    public record RecipeDto(
        int Id,
        string Title,
        string? Description,
        string? Category,
        string? DietType,
        int? Calories,
        decimal? ProteinG,
        decimal? CarbsG,
        decimal? FatG,
        int? PrepTimeMin,
        int? CookTimeMin,
        int? ServingsCount,
        string? ImageUrl,
        bool IsFeatured,
        IEnumerable<string> Allergens
    );
}
