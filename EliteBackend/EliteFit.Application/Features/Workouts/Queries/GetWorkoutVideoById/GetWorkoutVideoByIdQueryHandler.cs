using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Workouts;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using MediatR;

namespace EliteFit.Application.Features.Workouts.Queries.GetWorkoutVideoById
{
    public class GetWorkoutVideoByIdQueryHandler : IRequestHandler<GetWorkoutVideoByIdQuery, WorkoutVideoDto>
    {
        private readonly IWorkoutVideoRepository _workoutVideoRepository;

        public GetWorkoutVideoByIdQueryHandler(IWorkoutVideoRepository workoutVideoRepository)
        {
            _workoutVideoRepository = workoutVideoRepository;
        }

        public async Task<WorkoutVideoDto> Handle(GetWorkoutVideoByIdQuery request, CancellationToken cancellationToken)
        {
            // Përdorim metodën ekzistuese të repozitorit tënd
            var video = await _workoutVideoRepository.GetByIdAsync(request.Id, cancellationToken);

            if (video == null)
            {
                return null;
            }

            // Kthejmë DTO-në e mapuar saktë për React-in
            return new WorkoutVideoDto
            {
                Id = video.Id,
                Title = video.Title,
                Description = video.Description,
                DurationSeconds = video.DurationSeconds ?? 0,
                Difficulty = video.DifficultyLevel,
                MuscleGroup = video.MuscleGroup,
                EstimatedCaloriesBurned = video.EstimatedCaloriesBurned,

                // Kjo nxjerr rrugën e saktë të videos. 
                // Kujdes: Nëse v.VideoFile vjen null sepse GetByIdAsync nuk bën ".Include(v => v.VideoFile)",
                // do të duhet të shtosh .Include te metoda GetByIdAsync brenda WorkoutVideoRepository.
                VideoUrl = video.VideoFile != null ? video.VideoFile.FilePath : null
            };
        }
    }
}