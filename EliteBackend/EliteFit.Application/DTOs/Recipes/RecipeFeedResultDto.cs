namespace EliteFit.Application.DTOs.Recipes
{
    public record RecipeFeedResultDto(
        IEnumerable<RecipeDto> Items,
        int TotalCount,
        int Page,
        int PageSize,
        int TotalPages
    );
}
