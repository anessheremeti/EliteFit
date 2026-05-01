using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Query;
using EliteFit.Persistence.Persistence.Context;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
namespace EliteFit.Persistence.Repositories.Recipes.Query
{
    public class RecipesQueryRepositories(MongoDbContext context) : IRecipesQueryRepositories
    {
        public async Task<Recipe> GetRecipeByIdAsync(string id)
        {
            var filter = Builders<Recipe>.Filter.Eq("Id", id);
            return await context.Recipe.Find(filter).FirstOrDefaultAsync();
        }
        public async Task<List<Recipe>> GetAllRecipesAsync()
        {
            return await context.Recipe.Find(_ => true).ToListAsync();
        }
        public async Task<long> CountRecipe() { 
            return await context.Recipe.CountDocumentsAsync(Builders<Recipe>.Filter.Empty);
        }

        }
}
