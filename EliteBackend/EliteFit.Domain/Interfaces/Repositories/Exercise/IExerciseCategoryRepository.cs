using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories.Exercise
{

    
    public interface IExerciseCategoryRepository
    {
        Task <List<ExerciseCategory>> GetAllAsync (CancellationToken cancellationToken);
        Task<ExerciseCategory?> GetByIdAsync (int id,CancellationToken cancellationToken);
        Task AddAsync(ExerciseCategory category,CancellationToken cancellationToken);
        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}
