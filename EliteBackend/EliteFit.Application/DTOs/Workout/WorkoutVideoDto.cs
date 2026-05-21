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
}
