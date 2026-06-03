
using MediatR;
using System.Collections.Generic;
using EliteFit.Application.DTOs.Workouts;

namespace EliteFit.Application.Features.Workouts.Queries.GetWorkoutVideos
{
    public class GetWorkoutVideosQuery : IRequest<List<WorkoutVideoDto>>
    {
        public int? CategoryId { get; set; }
        public string? DifficultyLevel { get; set; }
    }
}