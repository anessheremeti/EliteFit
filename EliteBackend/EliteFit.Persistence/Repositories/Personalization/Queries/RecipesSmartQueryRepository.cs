using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Personalization;
using EliteFit.Persistence.Persistence.Context;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Persistence.Repositories.Personalization.Queries
{
    public class RecipesSmartQueryRepository : IRecipesSmartQueryRepository
    {
        private readonly MongoDbContext _mongoContext;

        public RecipesSmartQueryRepository(MongoDbContext mongoContext)
        {
            _mongoContext = mongoContext;
        }

        public async Task<List<Recipe>> GetSafeRecipesAsync(List<int> excludedAllergyIds, int? maxCalories, int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var filterBuilder = Builders<Recipe>.Filter;
            var filter = filterBuilder.Empty;

            // Logjika e rëndësishme: Përjashtojmë recetat që përmbajnë allergy_id e përdoruesit
            if (excludedAllergyIds != null && excludedAllergyIds.Any())
            {
                filter &= filterBuilder.Not(
                    filterBuilder.ElemMatch(r => r.Allergens, a => excludedAllergyIds.Contains(a.AllergyId))
                );
            }

            // Filtri i kalorive maksimale nëse është dërguar si parametër
            if (maxCalories.HasValue)
            {
                filter &= filterBuilder.Lte(r => r.Calories, maxCalories.Value);
            }

            // Ekzekutimi me Paginim direkt në MongoDB
            return await _mongoContext.Recipe
                .Find(filter)
                .Skip((pageNumber - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync(cancellationToken);
        }
    }
}
