using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using EliteFit.Domain.Interfaces.Repositories.Media; // Shto këtë për IFileRepository

namespace EliteFit.Application.Features.Workouts.Commands.CreateWorkoutVideo
{
    public class CreateWorkoutVideoCommandHandler : IRequestHandler<CreateWorkoutVideoCommand, int>
    {
        private readonly IWorkoutVideoRepository _workoutRepository;
        private readonly IFileRepository _fileRepository; // Shto këtë

        // Përditësojmë konstruktorin
        public CreateWorkoutVideoCommandHandler(IWorkoutVideoRepository workoutRepository, IFileRepository fileRepository)
        {
            _workoutRepository = workoutRepository;
            _fileRepository = fileRepository;
        }

        public async Task<int> Handle(CreateWorkoutVideoCommand request, CancellationToken cancellationToken)
        {
            // 1. Krijojmë një rekord në tabelën e skedarëve (FileEntity) për linkun e YouTube
            var youtubeFileEntity = new FileEntity
            {
                Entity = "WorkoutVideo",
                Filename = "YouTube_Link", // Emër fiktiv për ta dalluar
                FilePath = request.VideoUrl, // <--- Këtu ruhet linku i YouTube (psh: https://youtube.com/...)
                FileSize = 0, // Nuk ka madhësi fizike
                UploadedBy = request.UploaderId
            };

            // Ruajmë linkun e YouTube në tabelën e fajllave që të marrim ID-në e saj
            await _fileRepository.AddAsync(youtubeFileEntity);
            await _fileRepository.SaveChangesAsync(); // Supozojmë se kjo metodë ekziston ose bëhet përmes UoW

            // 2. Krijojmë entitetin e stërvitjes duke përdorur ID-në e fajllit që sapo krijuam
            var workoutVideo = new WorkoutVideo
            {
                Title = request.Title,
                Description = request.Description,
                CategoryId = request.CategoryId,
                DurationSeconds = request.DurationSeconds ?? 0,
                DifficultyLevel = request.DifficultyLevel,
                MuscleGroup = request.MuscleGroup,
                EstimatedCaloriesBurned = request.EstimatedCaloriesBurned ?? 0,

                // RREGULLIMI KRITIK: Lidhim videon me linkun e YouTube përmes ID-së së FileEntity
                VideoFileId = youtubeFileEntity.Id
            };

            // 3. Ruajmë stërvitjen në databazë
            var workoutVideoId = await _workoutRepository.AddAsync(workoutVideo, cancellationToken);

            // Pasi u krijua WorkoutVideo, përditësojmë EntityId tek tabela e fajllave për lidhje të plotë dypalëshe
            youtubeFileEntity.EntityId = workoutVideoId;
            await _fileRepository.SaveChangesAsync();

            await _workoutRepository.SaveChangesAsync(cancellationToken);

            return workoutVideoId;
        }
    }
}