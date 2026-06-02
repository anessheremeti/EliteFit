using MediatR;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Media;
using EliteFit.Domain.Interfaces.Repositories.Media;

namespace EliteFit.Application.Features.Media.Queries.GetFileById
{
    public class GetFileByIdQueryHandler : IRequestHandler<GetFileByIdQuery, FileDto?>
    {
        private readonly IFileRepository _fileRepository;

        public GetFileByIdQueryHandler(IFileRepository fileRepository)
        {
            _fileRepository = fileRepository;
        }

        public async Task<FileDto?> Handle(GetFileByIdQuery request, CancellationToken cancellationToken)
        {
            var file = await _fileRepository.GetByIdAsync(request.Id);
            if (file == null) return null;

            return new FileDto(
                file.Id,
                file.Filename,
                file.FilePath,
                file.FileSize,
                file.Entity,
                file.EntityId
            );
        }
    }
}