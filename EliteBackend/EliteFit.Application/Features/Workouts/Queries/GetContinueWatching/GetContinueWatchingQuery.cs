using EliteFit.Application.DTOs.Workouts; // Nëse do të bësh një DTO të re ose përdor një anonim
using MediatR;
using System.Collections.Generic;

namespace EliteFit.Application.Features.Workouts.Queries.GetContinueWatching
{
    public record GetContinueWatchingQuery : IRequest<List<ContinueWatchingDto>>
    {
        public int UserId { get; set; }
    }
}