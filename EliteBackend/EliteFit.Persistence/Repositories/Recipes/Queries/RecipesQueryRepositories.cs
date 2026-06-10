using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Queries;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Persistence.Repositories.Recipes.Queries
{
    public class RecipesQueryRepositories(ApplicationDbContext context) : IRecipesQueryRepositories
    {
        // 1. Merr recetën sipas ID-së si String (Nëse ndonjë pjesë e kodit e thërret si string)
        public async Task<Recipe?> GetRecipeByIdAsync(string id)
        {
            if (int.TryParse(id, out var intId))
            {
                return await context.Recipes
                    .Include(r => r.ImageFile)
                    .FirstOrDefaultAsync(r => r.Id == intId);
            }
            return null;
        }

        // 2. Merr recetën sipas ID-së si Int (Kjo që po thërret Swaggeri)
        public async Task<Recipe?> GetRecipeByIdAsync(int id, CancellationToken ct)
        {
            return await context.Recipes
                .Include(r => r.ImageFile)
                .FirstOrDefaultAsync(r => r.Id == id, ct);
        }

        // 3. Merr të gjitha recetat nga SQL Server
        public async Task<List<Recipe>> GetAllRecipesAsync()
        {
            return await context.Recipes
                .Include(r => r.ImageFile)
                .ToListAsync();
        }

        // 4. Numëro recetat
        public async Task<long> CountRecipe()
        {
            return await context.Recipes.LongCountAsync();
        }

        // 5. Filtrimi i recetave dhe bllokimi i alergjive direkt në SQL Server
        public async Task<List<Recipe>> GetFilteredRecipesAsync(int userId, int? maxCalories, decimal? minProteinG, CancellationToken ct)
        {
            // Hapi 1: Lexojmë ID-të e alergjive që ka ky përdorues
            var userAllergyIds = await context.UserAllergies
                .Where(ua => ua.UserId == userId)
                .Select(ua => ua.AllergyId)
                .ToListAsync(ct);

            // Krijojmë query-n bazë për recetat
            var query = context.Recipes.AsQueryable();

            // Hapi 2: Nëse përdoruesi ka alergji, gjejmë cilat receta duhen bllokuar
            if (userAllergyIds.Any())
            {
                var excludedRecipeIds = await context.RecipeAllergens
                    .Where(ra => userAllergyIds.Contains(ra.AllergyId))
                    .Select(ra => ra.RecipeId)
                    .ToListAsync(ct);

                // Hapi 3: Largojmë recetat e bllokuara nga lista
                if (excludedRecipeIds.Any())
                {
                    query = query.Where(recipe => !excludedRecipeIds.Contains(recipe.Id));
                }
            }

            // 3. Filtrimi sipas kalorive ose proteinave
            if (maxCalories.HasValue)
            {
                query = query.Where(r => r.Calories <= maxCalories.Value);
            }

            if (minProteinG.HasValue)
            {
                query = query.Where(r => r.ProteinG >= minProteinG.Value);
            }

            return await query.Include(r => r.ImageFile).ToListAsync(ct);
        }
    }
}
