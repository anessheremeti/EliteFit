using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;

namespace EliteFit.Domain.Interfaces.Repositories.Media
{
    public  interface IFileRepository
    {
        Task<FileEntity?> GetByIdAsync(int id);
        Task<IEnumerable<FileEntity>> GetByEntityAsync(string entity, int entityId);
        Task AddAsync(FileEntity file);
        void Delete(FileEntity file);
        Task<bool> SaveChangesAsync();

    }
}
