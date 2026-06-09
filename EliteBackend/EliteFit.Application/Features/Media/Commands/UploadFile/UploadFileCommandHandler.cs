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

            // Sigurohemi që stream-i të lexohet nga fillimi
            if (request.FileStream.CanSeek)
            {
                request.FileStream.Position = 0;
            }

            // RREGULLIMI KRYESOR: Përdorim Directory.GetCurrentDirectory() në vend të AppContext.BaseDirectory
            // për të kapur dosjen e saktë të projektit ku ndodhet 'wwwroot'
            string baseDir = Directory.GetCurrentDirectory();
            string tempFolder = Path.Combine(baseDir, "wwwroot", "uploads", "temp");

            if (!Directory.Exists(tempFolder))
            {
                Directory.CreateDirectory(tempFolder);
            }

            // Sigurohemi që emri i fajllit nuk ka karaktere të rrezikshme (path injection)
            string safeFileName = Path.GetFileName(request.Filename);
            string ext = Path.GetExtension(safeFileName).ToLower();
            string tempFileName = $"{Guid.NewGuid()}_{safeFileName}";
            string tempFilePath = Path.Combine(tempFolder, tempFileName);

            // 1. Ruajmë skedarin e përkohshëm në disk
            using (var fileStream = new FileStream(tempFilePath, FileMode.Create, FileAccess.Write))
            {
                await request.FileStream.CopyToAsync(fileStream, cancellationToken);
            }

            // Përcaktojmë llojet e skedarëve
            string[] videoExtensions = { ".mp4", ".mov", ".avi", ".mkv", ".wmv", ".flv" };
            string[] imageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp" };

            bool isVideo = videoExtensions.Contains(ext);
            bool isImage = imageExtensions.Contains(ext);

            string uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(safeFileName)}";
            string finalDbPath;
            string finalDiskPath = null;

            // 2. Gjenerojmë rrugën përfundimtare varësisht nga lloji i fajllit
            if (isVideo)
            {
                finalDbPath = $"/uploads/videos/{uniqueFileName}.mp4";
            }
            else if (isImage)
            {
                finalDbPath = $"/uploads/images/{uniqueFileName}{ext}";
                string imagesFolder = Path.Combine(baseDir, "wwwroot", "uploads", "images");
                if (!Directory.Exists(imagesFolder)) Directory.CreateDirectory(imagesFolder);
                finalDiskPath = Path.Combine(imagesFolder, $"{uniqueFileName}{ext}");
            }
            else
            {
                // Për dokumente ose skedarë të tjerë
                finalDbPath = $"/uploads/others/{uniqueFileName}{ext}";
                string othersFolder = Path.Combine(baseDir, "wwwroot", "uploads", "others");
                if (!Directory.Exists(othersFolder)) Directory.CreateDirectory(othersFolder);
                finalDiskPath = Path.Combine(othersFolder, $"{uniqueFileName}{ext}");
            }

            long finalSize = request.FileStream.Length;

            // 3. Menaxhimi i skedarit fizik sipas llojit (E bëjmë PARA se ta ruajmë në DB)
            if (!isVideo && finalDiskPath != null)
            {
                if (File.Exists(tempFilePath))
                {
                    // Lëvizim fajllin nga temp në lokacionin përfundimtar (overwrite: true për siguri)
                    File.Move(tempFilePath, finalDiskPath, true);
                }
                else
                {
                    throw new FileNotFoundException("Skedari i përkohshëm nuk u gjet pas ngarkimit.");
                }
            }

            // 4. Krijojmë rekordet në Databazë TANI që jemi të sigurt që fajlli u ruajt
            var fileEntity = new FileEntity
            {
                Entity = request.Entity,
                EntityId = request.EntityId,
                Filename = isVideo ? Path.ChangeExtension(safeFileName, ".mp4") : safeFileName,
                FilePath = finalDbPath,
                FileSize = finalSize,
                UploadedBy = request.UploaderId
            };

            await _fileRepository.AddAsync(fileEntity);
            await _fileRepository.SaveChangesAsync();

            // 5. Nisim procesimin e videos në prapavijë pa penguar response-in
            if (isVideo)
            {
                _ = Task.Run(async () =>
                {
                    try
                    {
                        var processVideoCommand = new ProcessVideoCommand(tempFilePath, safeFileName);
                        await _mediator.Send(processVideoCommand);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[FFmpeg Background Error]: {ex.Message}");
                    }
                });
            }

            // Kthejmë ID-në e skedarit te front-end-i menjëherë
            return fileEntity.Id;
        }
    }
}