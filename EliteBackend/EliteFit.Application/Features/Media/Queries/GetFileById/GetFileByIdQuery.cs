using MediatR;
using EliteFit.Application.Features.Media.Commands.UploadFile;
using EliteFit.Application.DTOs.Media;

namespace EliteFit.Application.Features.Media.Queries.GetFileById
{
    public record GetFileByIdQuery(int Id) : IRequest<FileDto?>;
}