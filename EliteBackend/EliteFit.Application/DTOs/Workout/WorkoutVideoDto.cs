<<<<<<< HEAD
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Workout
{
    public class WorkoutVideoDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? VideoFileId { get; set; }
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int? DurationSeconds { get; set; }
        public string DifficultyLevel { get; set; } = string.Empty;
        public string MuscleGroup { get; set; } = string.Empty;
        public int? EstimatedCaloriesBurned { get; set; }
    }
=======
namespace EliteFit.Application.DTOs.Workout
{
    public record WorkoutVideoDto(
        int Id,
        string Title,
        string ExerciseName,
        string? Category,
        string? MuscleGroup,
        string? DifficultyLevel,
        int? DurationSeconds,
        int? EstimatedCaloriesBurned,
        string VideoUrl
    );
>>>>>>> master
}
