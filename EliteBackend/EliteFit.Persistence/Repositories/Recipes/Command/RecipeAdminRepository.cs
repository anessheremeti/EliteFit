using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Persistence.Repositories.Recipes.Command
{
    public class RecipeAdminRepository : IRecipeAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public RecipeAdminRepository(ApplicationDbContext context) => _context = context;

        public async Task<Recipe?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Recipes
                .Include(r => r.Allergens)
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
        }
        public async Task<List<Recipe>> GetAllForAdminAsync(string? searchTerm, int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = _context.Recipes.Include(r => r.Allergens).AsQueryable();

            // 1. Kërkimi (Nëse ka vlerë SearchTerm)
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(r => r.Title.Contains(searchTerm));
            }

            // 2. Paginimi dhe Kthimi i Listës
            return await query
                .OrderByDescending(r => r.Id)
                .Skip((pageNumber - 1) * pageSize) // Kapërcen recetat e faqeve të kaluara
                .Take(pageSize)                    // Merr vetëm sasinë e caktuar për faqe
                .ToListAsync(cancellationToken);
        }
        public async Task<List<Recipe>> GetAllForAdminAsync(CancellationToken cancellationToken)
        {
            return await _context.Recipes
                .Include(r => r.Allergens)
                .OrderByDescending(r => r.Id)
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(Recipe recipe, CancellationToken cancellationToken)
        {
            await _context.Recipes.AddAsync(recipe, cancellationToken);
        }

        public void Update(Recipe recipe) => _context.Recipes.Update(recipe);

        public void Delete(Recipe recipe) => _context.Recipes.Remove(recipe);

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
