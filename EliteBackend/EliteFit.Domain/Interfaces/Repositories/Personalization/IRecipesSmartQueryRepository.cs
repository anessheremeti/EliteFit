using EliteFit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Personalization
{
    public interface IRecipesSmartQueryRepository
    {
        Task<List<Recipe>> GetSafeRecipesAsync(List<int> excludedAllergyIds, int? maxCalories, int pageNumber, int pageSize, CancellationToken cancellationToken);
    }
}
