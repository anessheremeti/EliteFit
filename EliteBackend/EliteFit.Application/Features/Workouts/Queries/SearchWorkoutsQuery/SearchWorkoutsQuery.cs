using MediatR;
using System.Collections.Generic;
using EliteFit.Application.DTOs.Workouts;

namespace EliteFit.Application.Features.Workouts.Queries.SearchWorkoutsQuery
{
    // Kthejmë direkt List<WorkoutVideoDto> pa wrapper class
    public class SearchWorkoutsQuery : IRequest<List<WorkoutVideoDto>>
    {
        public string? SearchTerm { get; set; }
        public string? Difficulty { get; set; }
        public string? MuscleGroup { get; set; }
        public string? Duration { get; set; }
        public string? SortBy { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}