using MediatR;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Media;
using EliteFit.Application.Features.Media.Commands.ProcessVideo;

namespace EliteFit.Application.Features.Media.Commands.UploadFile
{
    public class UploadFileCommandHandler : IRequestHandler<UploadFileCommand, int>
    {
        private readonly IFileRepository _fileRepository;
        private readonly IMediator _mediator;

        public UploadFileCommandHandler(IFileRepository fileRepository, IMediator mediator)
        {
            _fileRepository = fileRepository;
            _mediator = mediator;
        }

        public async Task<int> Handle(UploadFileCommand request, CancellationToken cancellationToken)
        {
            if (request.FileStream == null || request.FileStream.Length == 0)
                throw new ArgumentException("Fajlli është i zbrazët ose invalid.");

            string baseDir = AppContext.BaseDirectory;
            string tempFolder = Path.Combine(baseDir, "wwwroot", "uploads", "temp");

            if (!Directory.Exists(tempFolder))
            {
                Directory.CreateDirectory(tempFolder);
            }

            string tempFileName = $"{Guid.NewGuid()}_{Path.GetFileName(request.Filename)}";
            string tempFilePath = Path.Combine(tempFolder, tempFileName);

            using (var fileStream = new FileStream(tempFilePath, FileMode.Create))
            {
                await request.FileStream.CopyToAsync(fileStream, cancellationToken);
            }

            string finalDbPath = string.Empty;
            long finalSize = request.FileStream.Length;
            string ext = Path.GetExtension(request.Filename).ToLower();
            string[] videoExtensions = { ".mp4", ".mov", ".avi", ".mkv", ".wmv", ".flv" };

            if (videoExtensions.Contains(ext))
            {
                // Thirrja e procesimit të videos
                var processVideoCommand = new ProcessVideoCommand(tempFilePath, request.Filename);
                var metadata = await _mediator.Send(processVideoCommand, cancellationToken);

                finalDbPath = metadata.FilePath;
                finalSize = metadata.FileSize;
            }
            else
            {
                string regularUploadsFolder = Path.Combine(baseDir, "wwwroot", "uploads");
                if (!Directory.Exists(regularUploadsFolder)) Directory.CreateDirectory(regularUploadsFolder);

                string finalRegularPath = Path.Combine(regularUploadsFolder, tempFileName);
                File.Move(tempFilePath, finalRegularPath);
                finalDbPath = $"/uploads/{tempFileName}";
            }

            var fileEntity = new FileEntity
            {
                Entity = request.Entity,
                EntityId = request.EntityId,
                Filename = videoExtensions.Contains(ext) ? Path.ChangeExtension(request.Filename, ".mp4") : request.Filename,
                FilePath = finalDbPath,
                FileSize = finalSize,
                UploadedBy = request.UploaderId
            };

            await _fileRepository.AddAsync(fileEntity);
            await _fileRepository.SaveChangesAsync();

            return fileEntity.Id;
        }
    }
}