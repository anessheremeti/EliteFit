using MediatR;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Interfaces.Repositories.Media;

namespace EliteFit.Application.Features.Media.Commands.DeleteFile
{
    public class DeleteFileCommandHandler : IRequestHandler<DeleteFileCommand, bool>
    {
        private readonly IFileRepository _fileRepository;

        public DeleteFileCommandHandler(IFileRepository fileRepository)
        {
            _fileRepository = fileRepository;
        }

        public async Task<bool> Handle(DeleteFileCommand request, CancellationToken cancellationToken)
        {
            var fileEntity = await _fileRepository.GetByIdAsync(request.Id);
            if (fileEntity == null) return false;

            // Fshirja fizike nga folderi wwwroot/uploads
            if (!string.IsNullOrEmpty(fileEntity.FilePath))
            {
                string fullPath = Path.Combine(AppContext.BaseDirectory, "wwwroot", fileEntity.FilePath.TrimStart('/'));
                try
                {
                    if (File.Exists(fullPath))
                    {
                        File.Delete(fullPath);
                    }
                }
                catch (Exception ex)
                {
                   return false;

                }
            }

            // Fshirja nga Databaza
            _fileRepository.Delete(fileEntity);
            return await _fileRepository.SaveChangesAsync();
        }
    }
}