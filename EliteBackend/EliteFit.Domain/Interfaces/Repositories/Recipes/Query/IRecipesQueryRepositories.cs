using EliteFit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Recipes.Query
{
    public interface IRecipesQueryRepositories
    {
        Task<long> CountRecipe();
         Task<Recipe> GetRecipeByIdAsync(string id);
         Task<List<Recipe>> GetAllRecipesAsync();
        Task<List<Recipe>> GetFilteredRecipesAsync(int userId, int? maxCalories, decimal? minProteinG, CancellationToken ct);

        // Kthen një entitet të vetëm Recipe sipas Id-së
        Task<Recipe?> GetRecipeByIdAsync(int id, CancellationToken ct);
    }
}
