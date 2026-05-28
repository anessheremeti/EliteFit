using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Query;
using EliteFit.Persistence.Persistence.Context;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Persistence.Repositories.Recipes.Query
{
    public class RecipesQueryRepositories(MongoDbContext context) : IRecipesQueryRepositories
    {
        // 1. Merr recetën sipas ID-së si String (ID-ja tipike e MongoDB ObjectId)
        public async Task<Recipe> GetRecipeByIdAsync(string id)
        {
            var filter = Builders<Recipe>.Filter.Eq("Id", id);
            return await context.Recipe.Find(filter).FirstOrDefaultAsync();
        }

        // 2. Merr recetën sipas ID-së si Int (Nëse i ke ruajtur ID-të si numra të plotë)
        public async Task<Recipe?> GetRecipeByIdAsync(int id, CancellationToken ct)
        {
            var filter = Builders<Recipe>.Filter.Eq(r => r.Id, id);
            return await context.Recipe.Find(filter).FirstOrDefaultAsync(ct);
        }

        public async Task<List<Recipe>> GetAllRecipesAsync()
        {
            return await context.Recipe.Find(_ => true).ToListAsync();
        }

        public async Task<long> CountRecipe()
        {
            return await context.Recipe.CountDocumentsAsync(Builders<Recipe>.Filter.Empty);
        }

        // TASKU I FILTRIMIT DHE ALERGJIVE ME MONGODB
        public async Task<List<Recipe>> GetFilteredRecipesAsync(int userId, int? maxCalories, decimal? minProteinG, CancellationToken ct)
        {
            // Hapi 1: Lexojmë ID-të e alergjive që ka ky përdorues nga koleksioni UserAllergies
            var userAllergyIds = await context.UserAllergies.AsQueryable()
                .Where(ua => ua.UserId == userId)
                .Select(ua => ua.AllergyId)
                .ToListAsync(ct);

            // Krijojmë query-n bazë për recetat
            var query = context.Recipe.AsQueryable();

            // Hapi 2: Nëse përdoruesi ka alergji, gjejmë cilat receta duhen bllokuar
            if (userAllergyIds.Any())
            {
                var excludedRecipeIds = await context.RecipeAllergens.AsQueryable()
                    .Where(ra => userAllergyIds.Contains(ra.AllergyId))
                    .Select(ra => ra.RecipeId)
                    .ToListAsync(ct);

                // Hapi 3: Largojmë recetat e bllokuara nga query kryesor
                if (excludedRecipeIds.Any())
                {
                    query = query.Where(recipe => !excludedRecipeIds.Contains(recipe.Id));
                }
            }

            // 3. Filtrimi sipas kalorive ose proteinave (nëse janë dërguar)
            if (maxCalories.HasValue)
            {
                query = query.Where(r => r.Calories <= maxCalories.Value);
            }

            if (minProteinG.HasValue)
            {
                query = query.Where(r => r.ProteinG >= minProteinG.Value);
            }

            // Kthen listën finale të entiteteve Recipe nga MongoDB
            return await query.ToListAsync(ct);
        }
    }
}
