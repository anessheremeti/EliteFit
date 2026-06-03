using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using EliteFit.Domain.Interfaces.services;
using MediatR;

namespace EliteFit.Application.Features.Workouts.Commands.CreateWorkoutVideo
{
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
            // Thirrja e shërbimit të storage duke kaluar Stream-in
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
}