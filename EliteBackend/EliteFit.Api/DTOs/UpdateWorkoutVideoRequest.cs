using System.ComponentModel.DataAnnotations;

namespace EliteFit.Api.DTOs
{
    public class UpdateWorkoutVideoRequest
    {
        [Required(ErrorMessage = "ID e videos është e detyrueshme.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Titulli është i detyrueshëm.")]
        public string Title { get; set; }

        public string Description { get; set; }

        public int? CategoryId { get; set; }

        public int? DurationSeconds { get; set; }

        public string DifficultyLevel { get; set; }

        public string MuscleGroup { get; set; }

        public int? EstimatedCaloriesBurned { get; set; }

        // ? e bën opsionale nëse përdoruesi nuk dëshiron të ndryshojë skedarin
        public IFormFile? VideoFile { get; set; }
    }
}
