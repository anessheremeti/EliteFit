using MediatR;
using System.IO;

namespace EliteFit.Application.Features.Workouts.Commands.CreateWorkoutVideo
{
    public class CreateWorkoutVideoCommand : IRequest<int>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }
        public int? DurationSeconds { get; set; }
        public string DifficultyLevel { get; set; }
        public string MuscleGroup { get; set; }
        public int? EstimatedCaloriesBurned { get; set; }
        public int? UploaderId { get; set; }

        // Shtuar:
        public string VideoUrl { get; set; }
    }
}