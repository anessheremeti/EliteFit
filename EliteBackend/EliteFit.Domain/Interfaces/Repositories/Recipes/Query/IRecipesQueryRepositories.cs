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
    }
}
