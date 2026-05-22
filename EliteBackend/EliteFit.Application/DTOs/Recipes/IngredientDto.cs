namespace EliteFit.Application.DTOs.Recipes
{
    public record IngredientDto(
        string Name,
        string? Amount,
        string? Unit,
        string? Notes
    );
}
