using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly ApplicationDbContext _context;

        public RecipeRepository(ApplicationDbContext context) => _context = context;

        public async Task<(IEnumerable<Recipe> Items, int TotalCount)> GetFeedAsync(
            int userId,
            string? category,
            string? dietType,
            string? search,
            int page,
            int pageSize)
        {
            // Fetch user's allergen IDs — used in the server-side NOT EXISTS subquery
            var allergyIds = await _context.UserAllergies
                .Where(ua => ua.UserId == userId)
                .Select(ua => ua.AllergyId)
                .ToListAsync();

            // Auto-apply the user's diet preference when no explicit filter is supplied
            if (string.IsNullOrWhiteSpace(dietType))
            {
                dietType = await _context.UserProfiles
                    .Where(p => p.UserId == userId)
                    .Select(p => p.DietType)
                    .FirstOrDefaultAsync();
            }

            var query = _context.Recipes
                .Include(r => r.Allergens).ThenInclude(ra => ra.Allergy)
                .AsNoTracking()
                .AsQueryable();

            // Core safety filter — exclude every recipe that contains any allergen
            // the user is allergic to. EF Core translates this to NOT EXISTS, which
            // is efficient with the composite index on (recipe_id, allergy_id).
            if (allergyIds.Count > 0)
                query = query.Where(r => !r.Allergens.Any(ra => allergyIds.Contains(ra.AllergyId)));

            if (!string.IsNullOrWhiteSpace(category) && category != "All")
                query = query.Where(r => r.Category == category);

            // Diet type: if user is e.g. "Vegan", include both Vegan and Standard recipes
            if (!string.IsNullOrWhiteSpace(dietType) && dietType != "All" && dietType != "Standard")
                query = query.Where(r => r.DietType == dietType || r.DietType == "Standard");

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(r =>
                    r.Title.Contains(term) ||
                    (r.Description != null && r.Description.Contains(term)));
            }

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(r => r.IsFeatured)
                .ThenBy(r => r.SortOrder)
                .ThenBy(r => r.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task<Recipe?> GetByIdAsync(int id)
            => await _context.Recipes
                .Include(r => r.Allergens).ThenInclude(ra => ra.Allergy)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id);

        public async Task<IEnumerable<string>> GetCategoriesAsync()
            => await _context.Recipes
                .Where(r => r.Category != null)
                .Select(r => r.Category!)
                .Distinct()
                .OrderBy(c => c)
                .AsNoTracking()
                .ToListAsync();

        public async Task<IEnumerable<string>> GetDietTypesAsync()
            => await _context.Recipes
                .Where(r => r.DietType != null)
                .Select(r => r.DietType!)
                .Distinct()
                .OrderBy(d => d)
                .AsNoTracking()
                .ToListAsync();
    }
}
