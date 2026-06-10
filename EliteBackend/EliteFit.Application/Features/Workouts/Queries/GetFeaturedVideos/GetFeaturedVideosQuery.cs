using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Workouts;
using MediatR;

namespace EliteFit.Application.Features.Workouts.Queries.GetFeaturedVideos
{
    public record GetFeaturedVideosQuery : IRequest<List<WorkoutVideoDto>>;
}
