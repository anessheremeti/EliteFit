using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories
{
    public interface IAllergyRepository
    {
        Task<IEnumerable<Allergy>> GetAllAsync();
        Task<IEnumerable<UserAllergy>> GetUserAllergiesAsync(int userId);
        Task SaveUserAllergiesAsync(int userId, IEnumerable<int> allergyIds);
        Task SaveChangesAsync();
    }
}
