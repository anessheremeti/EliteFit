using MediatR;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using EliteFit.Domain.Interfaces.services;

namespace EliteFit.Application.Features.Commands.Workouts;

public class CreateWorkoutVideoCommand : IRequest<int>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int? CategoryId { get; set; }
    public int? DurationSeconds { get; set; }
    public string DifficultyLevel { get; set; }
    public string MuscleGroup { get; set; }
    public int? EstimatedCaloriesBurned { get; set; }

    // Këtu përdorim Stream dhe emrin e fajllit
    public Stream FileStream { get; set; }
    public string FileName { get; set; }
    public int? UploaderId { get; set; }
}

public class CreateWorkoutVideoCommandHandler : IRequestHandler<CreateWorkoutVideoCommand, int>
{
    private readonly IWorkoutVideoRepository _workoutVideoRepository;
    private readonly IFileStorageService _fileStorageService;

    public CreateWorkoutVideoCommandHandler(
        IWorkoutVideoRepository workoutVideoRepository,
        IFileStorageService fileStorageService)
    {
        _workoutVideoRepository = workoutVideoRepository;
        _fileStorageService = fileStorageService;
    }

    public async Task<int> Handle(CreateWorkoutVideoCommand request, CancellationToken cancellationToken)
    {
        // Thirrja tani bëhet me Stream
        int fileId = await _fileStorageService.UploadFileAsync(
            request.FileStream,
            request.FileName,
            "videos",
            request.UploaderId,
            "WorkoutVideos",
            cancellationToken
        );

        var workoutVideo = new WorkoutVideo
        {
            Title = request.Title,
            Description = request.Description,
            CategoryId = request.CategoryId,
            DurationSeconds = request.DurationSeconds,
            DifficultyLevel = request.DifficultyLevel,
            MuscleGroup = request.MuscleGroup,
            EstimatedCaloriesBurned = request.EstimatedCaloriesBurned,
            VideoFileId = fileId
        };

        return await _workoutVideoRepository.AddAsync(workoutVideo, cancellationToken);
    }
}