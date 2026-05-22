using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IRecipeRepository
    {
        Task<(IEnumerable<Recipe> Items, int TotalCount)> GetFeedAsync(
            int userId,
            string? category,
            string? dietType,
            string? search,
            int page,
            int pageSize);

        Task<Recipe?> GetByIdAsync(int id);
        Task<IEnumerable<string>> GetCategoriesAsync();
        Task<IEnumerable<string>> GetDietTypesAsync();
    }
}
