namespace EliteFit.Application.DTOs.ExerciseLog
{
    public record ExerciseLogDto(
        int     Id,
        int?    ExerciseId,
        string  ExerciseName,
        string? BodyPart,
        int?    WorkoutId,
        int?    CaloriesBurned,
        int?    DurationSeconds,
        DateTime? CompletedAt,
        string? Notes,
        DateTime? CreatedAt
    );
}
