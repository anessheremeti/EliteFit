using EliteFit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Recipes.Command
{
    public interface IRecipeAdminRepository
    {
        Task<Recipe?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task AddAsync(Recipe recipe, CancellationToken cancellationToken);
         Task<List<Recipe>> GetAllForAdminAsync(CancellationToken cancellationToken);
        void Update(Recipe recipe);
        void Delete(Recipe recipe);
        Task<List<Recipe>> GetAllForAdminAsync(string? searchTerm, int pageNumber, int pageSize, CancellationToken cancellationToken);

        Task SaveChangesAsync(CancellationToken cancellationToken);

    }
}
