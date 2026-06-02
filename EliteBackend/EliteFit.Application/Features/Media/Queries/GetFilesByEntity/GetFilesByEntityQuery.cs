using MediatR;
using System.Collections.Generic;
using EliteFit.Application.DTOs.Media;

namespace EliteFit.Application.Features.Media.Queries.GetFilesByEntity
{
    public record GetFilesByEntityQuery(string Entity, int EntityId) : IRequest<IEnumerable<FileDto>>;
}