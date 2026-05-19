using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories
{
    public class AllergyRepository : IAllergyRepository
    {
        private readonly ApplicationDbContext _context;

        public AllergyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Allergy>> GetAllAsync()
            => await _context.Allergies.OrderBy(a => a.Name).ToListAsync();

        public async Task<IEnumerable<UserAllergy>> GetUserAllergiesAsync(int userId)
            => await _context.UserAllergies
                .Include(ua => ua.Allergy)
                .Where(ua => ua.UserId == userId)
                .ToListAsync();

        public async Task SaveUserAllergiesAsync(int userId, IEnumerable<int> allergyIds)
        {
            var existing = await _context.UserAllergies
                .Where(ua => ua.UserId == userId)
                .ToListAsync();

            _context.UserAllergies.RemoveRange(existing);

            var incoming = allergyIds.Select(allergyId => new UserAllergy
            {
                UserId = userId,
                AllergyId = allergyId
            });

            await _context.UserAllergies.AddRangeAsync(incoming);
        }

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
