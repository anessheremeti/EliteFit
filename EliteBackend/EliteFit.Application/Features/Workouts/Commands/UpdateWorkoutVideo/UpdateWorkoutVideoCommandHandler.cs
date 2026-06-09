using MediatR;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using EliteFit.Domain.Interfaces.Repositories.Media;

namespace EliteFit.Application.Features.Workouts.Commands.UpdateWorkoutVideo
{
    public class UpdateWorkoutVideoCommandHandler : IRequestHandler<UpdateWorkoutVideoCommand, bool>
    {
        private readonly IWorkoutVideoRepository _workoutRepository;
        private readonly IFileRepository _fileRepository;

        public UpdateWorkoutVideoCommandHandler(IWorkoutVideoRepository workoutRepository, IFileRepository fileRepository)
        {
            _workoutRepository = workoutRepository;
            _fileRepository = fileRepository;
        }

        public async Task<bool> Handle(UpdateWorkoutVideoCommand request, CancellationToken cancellationToken)
        {
            var video = await _workoutRepository.GetByIdAsync(request.Id, cancellationToken);
            if (video == null) return false;

            // Përditësojmë tekstet e stërvitjes
            video.Title = request.Title ?? video.Title;
            video.Description = request.Description ?? video.Description;
            video.CategoryId = request.CategoryId ?? video.CategoryId;
            video.DurationSeconds = request.DurationSeconds ?? video.DurationSeconds;
            video.DifficultyLevel = request.DifficultyLevel ?? video.DifficultyLevel;
            video.MuscleGroup = request.MuscleGroup ?? video.MuscleGroup;
            video.EstimatedCaloriesBurned = request.EstimatedCaloriesBurned ?? video.EstimatedCaloriesBurned;

            // Përditësojmë Linkun e YouTube (nëse ka ardhur një i ri nga forma)
            if (!string.IsNullOrEmpty(request.VideoUrl))
            {
                if (video.VideoFileId.HasValue)
                {
                    // Nëse ka pasur link të vjetër, thjesht e mbishkruajmë
                    var existingFile = await _fileRepository.GetByIdAsync(video.VideoFileId.Value);
                    if (existingFile != null)
                    {
                        existingFile.FilePath = request.VideoUrl;
                        await _fileRepository.UpdateAsync(existingFile);
                    }
                }
                else
                {
                    // Nëse s'ka pasur link më parë, e krijojmë një të ri
                    var newYoutubeFile = new FileEntity
                    {
                        Entity = "WorkoutVideo",
                        EntityId = video.Id,
                        Filename = "YouTube_Link",
                        FilePath = request.VideoUrl,
                        FileSize = 0
                    };

                    // RREGULLIMI KËTU: Vetëm bëjmë await pa i caktuar variabël
                    await _fileRepository.AddAsync(newYoutubeFile);

                    // Pasi kryhet AddAsync, Entity Framework e mbush vetë fushën .Id e objektit
                    video.VideoFileId = newYoutubeFile.Id;
                }
            }

            await _workoutRepository.UpdateAsync(video, cancellationToken);
            return true;
        }
    }
}