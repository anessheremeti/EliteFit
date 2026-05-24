using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Workouts;
using EliteFit.Domain.Interfaces.Repositories.Workout; // Thirrja e Repository

namespace EliteFit.Application.Features.Queries.Workouts;

public class GetWorkoutVideosQuery : IRequest<List<WorkoutVideoDto>>
{
    public int? CategoryId { get; set; }
    public string? DifficultyLevel { get; set; }
}

public class GetWorkoutVideosQueryHandler : IRequestHandler<GetWorkoutVideosQuery, List<WorkoutVideoDto>>
{
    private readonly IWorkoutVideoRepository _workoutVideoRepository;

    // Injektojmë vetëm Repository-n e domenit
    public GetWorkoutVideosQueryHandler(IWorkoutVideoRepository workoutVideoRepository)
    {
        _workoutVideoRepository = workoutVideoRepository;
    }

    public async Task<List<WorkoutVideoDto>> Handle(GetWorkoutVideosQuery request, CancellationToken cancellationToken)
    {
        // Logjika e filtrimit bartet në Repository, Application vetëm pranon entitetet
        var videos = await _workoutVideoRepository.GetFilteredVideosAsync(request.CategoryId, request.DifficultyLevel, cancellationToken);

        // Mapimi i pastër i entiteteve në DTOs
        return videos.Select(v => new WorkoutVideoDto
        {
            Id = v.Id,
            Title = v.Title,
            Description = v.Description,
            CategoryId = v.CategoryId,
            DurationSeconds = v.DurationSeconds,
            DifficultyLevel = v.DifficultyLevel,
            MuscleGroup = v.MuscleGroup,
            EstimatedCaloriesBurned = v.EstimatedCaloriesBurned
        }).ToList();
    }
}