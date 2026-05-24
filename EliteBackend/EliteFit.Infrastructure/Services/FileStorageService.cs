using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.services;
using EliteFit.Persistence.Persistence.Context;

namespace EliteFit.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    private readonly ApplicationDbContext _context;

    public FileStorageService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> UploadFileAsync(Stream fileStream, string fileName, string folderName, int? uploaderId, string entityName, CancellationToken cancellationToken)
    {
        // 1. Sigurohu që folderi ekziston
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folderName);
        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

        // 2. Gjenero emër unik
        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        // 3. Kopjo stream-in në fajllin fizik
        using (var outputStream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(outputStream, cancellationToken);
        }

        // 4. Krijo entitetin (Sigurohu që fushat përputhen me FileEntity.cs)
        var fileEntity = new FileEntity
        {
            Entity = entityName,
            Filename = fileName,
            FilePath = $"/uploads/{folderName}/{uniqueFileName}",
            FileSize = new FileInfo(filePath).Length, // Merr madhësinë nga fajlli i ruajtur
            
            UploadedBy = uploaderId
        };

        // 5. Ruaj në DB
        await _context.Set<FileEntity>().AddAsync(fileEntity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return fileEntity.Id;
    }
}