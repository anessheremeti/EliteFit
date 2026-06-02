using MediatR;
using System.IO;

namespace EliteFit.Application.Features.Media.Commands.UploadFile
{
    public record UploadFileCommand(
        Stream FileStream,
        string Filename,
        string Entity,
        int EntityId,
        int UploaderId
    ) : IRequest<int>;
}
