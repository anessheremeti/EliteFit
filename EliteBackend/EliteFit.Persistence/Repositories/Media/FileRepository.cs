using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Media;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence.Repositories.Media
{
    public  class FileRepository : IFileRepository
    {
        private readonly ApplicationDbContext _context;

        public FileRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task <FileEntity?> GetByIdAsync(int id)
        {
            return await _context.Set<FileEntity>().FindAsync(id);
        }
        public async Task<IEnumerable<FileEntity>> GetByEntityAsync(string entity, int entityId)
        {
            return await _context.Set<FileEntity>()
                .Where(f => f.Entity == entity && f.EntityId == entityId)
                .ToListAsync();
        }
        public async Task AddAsync (FileEntity file)
        {
            await _context.Set<FileEntity> ().AddAsync(file);
        }
        public void Delete(FileEntity file)
        {
            _context.Set<FileEntity>().Remove(file) ;
        }
        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
