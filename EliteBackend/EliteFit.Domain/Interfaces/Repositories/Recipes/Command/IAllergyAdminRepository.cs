using EliteFit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Recipes.Command
{
    public interface IAllergyAdminRepository
    {
        Task<Allergy?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<List<Allergy>> GetAllForAdminAsync(string? searchTerm, int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task AddAsync(Allergy allergy, CancellationToken cancellationToken);
        void Update(Allergy allergy);
        void Delete(Allergy allergy);
        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}
