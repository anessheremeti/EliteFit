using System.ComponentModel.DataAnnotations;

namespace EliteFit.Api.DTOs
{
    public class CreateWorkoutVideoRequest
    {
        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public int? CategoryId { get; set; }

        public int? DurationSeconds { get; set; }

        public string DifficultyLevel { get; set; }

        public string MuscleGroup { get; set; }

        public int? EstimatedCaloriesBurned { get; set; }

        [Required]
        public IFormFile VideoFile { get; set; } // Kjo zëvendëson Stream-in për HTTP request

        public int? UploaderId { get; set; }
    }
}
