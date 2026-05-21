namespace EliteFit.Application.DTOs.ExerciseLog
{
    public record ExerciseSessionStatsDto(
        int TotalSessions,
        int TotalCalories,
        int TotalSeconds,
        DateTime? LastCompletedAt,
        int? BestDurationSeconds,
        int? BestCalories
    );
}
