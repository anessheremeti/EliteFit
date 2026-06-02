using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Media;
using EliteFit.Domain.Interfaces.Repositories.Media;

namespace EliteFit.Application.Features.Media.Queries.GetFilesByEntity
{
    public class GetFilesByEntityQueryHandler : IRequestHandler<GetFilesByEntityQuery, IEnumerable<FileDto>>
    {
        private readonly IFileRepository _fileRepository;

        public GetFilesByEntityQueryHandler(IFileRepository fileRepository)
        {
            _fileRepository = fileRepository;
        }

        public async Task<IEnumerable<FileDto>> Handle(GetFilesByEntityQuery request, CancellationToken cancellationToken)
        {
            var files = await _fileRepository.GetByEntityAsync(request.Entity, request.EntityId);

            return files.Select(file => new FileDto(
                file.Id,
                file.Filename,
                file.FilePath,
                file.FileSize,
                file.Entity,
                file.EntityId
            ));
        }
    }
}