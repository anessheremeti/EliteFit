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
    public class AllergyAdminRepository : IAllergyAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public AllergyAdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Allergy?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Allergies.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        }

        public async Task<List<Allergy>> GetAllForAdminAsync(string? searchTerm, int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = _context.Allergies.AsQueryable();

            // Kërkimi (Search)
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(a => a.Name.Contains(searchTerm));
            }

            // Paginimi (Pagination)
            return await query
                .OrderBy(a => a.Name) // Rreshtimi alfabetik për alergjitë
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(Allergy allergy, CancellationToken cancellationToken)
        {
            await _context.Allergies.AddAsync(allergy, cancellationToken);
        }

        public void Update(Allergy allergy) => _context.Allergies.Update(allergy);

        public void Delete(Allergy allergy) => _context.Allergies.Remove(allergy);

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
