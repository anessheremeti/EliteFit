namespace EliteFit.Application.DTOs.ExerciseLog
{
    /// <summary>
    /// Payload for logging a completed exercise.
    /// When <see cref="ExerciseId"/> is provided, <see cref="ExerciseName"/> and
    /// <see cref="BodyPart"/> are auto-populated from the linked WorkoutVideo; the caller
    /// may still override them explicitly.
    /// </summary>
    public record CreateExerciseLogRequest(
        int?    ExerciseId,
        string? ExerciseName,
        string? BodyPart,
        int?    WorkoutId,
        int?    CaloriesBurned,
        int?    DurationSeconds,
        DateTime? CompletedAt,
        string? Notes
    );
}
