using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Commands.Workouts
{
    public record CreateWorkoutVideoCommand : IRequest<int>
    {
        public string Title { get; init; } = string.Empty;
        public string Description { get; init; } = string.Empty;
        public int? VideoFileId { get; init; }
        public int? CategoryId { get; init; }
        public int? DurationSeconds { get; init; }
        public string DifficultyLevel { get; init; } = string.Empty;
        public string MuscleGroup { get; init; } = string.Empty;
        public int? EstimatedCaloriesBurned { get; init; }
    }

    public class CreateWorkoutVideoCommandHandler : IRequestHandler<CreateWorkoutVideoCommand, int>
    {
        private readonly IWorkoutRepository _workoutRepository;

        public CreateWorkoutVideoCommandHandler(IWorkoutRepository workoutRepository)
        {
            _workoutRepository = workoutRepository;
        }

        public async Task<int> Handle(CreateWorkoutVideoCommand command, CancellationToken cancellationToken)
        {
            var video = new WorkoutVideo
            {
                Title = command.Title,
                Description = command.Description,
                VideoFileId = command.VideoFileId,
                CategoryId = command.CategoryId,
                DurationSeconds = command.DurationSeconds,
                DifficultyLevel = command.DifficultyLevel,
                MuscleGroup = command.MuscleGroup,
                EstimatedCaloriesBurned = command.EstimatedCaloriesBurned
            };

            await _workoutRepository.AddAsync(video, cancellationToken);
            return video.Id; // Kthejmë Id-në e videos së krijuar rishtazi
        }
    }
}