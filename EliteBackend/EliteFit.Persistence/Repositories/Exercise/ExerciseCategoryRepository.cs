using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Persistence.Context;
using EliteFit.Domain.Interfaces.Repositories.Exercise;
namespace EliteFit.Persistence.Repositories.Exercise
{

    public class ExerciseCategoryRepository : IExerciseCategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public ExerciseCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<ExerciseCategory>>GetAllAsync (CancellationToken cancellationToken)
        {
            return await _context.Set<ExerciseCategory>().ToListAsync(cancellationToken);
        }
        public  async Task<ExerciseCategory?> GetByIdAsync(int id,CancellationToken cancellationToken)
        {
            return await _context.Set<ExerciseCategory>().FindAsync(id, cancellationToken);
        }
        public async Task AddAsync(ExerciseCategory category,CancellationToken cancellationToken)
        {
            await _context.Set<ExerciseCategory>().AddAsync(category, cancellationToken);
        }
        public async  Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        public Task UpdateAsync(ExerciseCategory category,CancellationToken cancellationToken)
        {
            _context.Set<ExerciseCategory>().Update(category);
            return Task.CompletedTask;
        }
        public Task DeleteAsync(ExerciseCategory category, CancellationToken cancellationToken)
        {
            _context.Set<ExerciseCategory>().Remove(category);
            return Task.CompletedTask;
        }
    }
}
