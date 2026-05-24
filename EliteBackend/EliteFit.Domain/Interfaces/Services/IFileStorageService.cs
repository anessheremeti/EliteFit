
using System.IO; // Përdor Stream në vend të IFormFile
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.services
{
    public interface IFileStorageService
    {
        Task<int> UploadFileAsync(Stream fileStream, string fileName, string folderName, int? uploaderId, string entityName, CancellationToken cancellationToken);
    }
}
