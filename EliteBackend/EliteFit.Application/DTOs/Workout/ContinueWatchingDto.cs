namespace EliteFit.Application.DTOs.Workout
{
    public record ContinueWatchingDto(
        int ProgressId,
        int WorkoutId,
        string Title,
        string? ThumbnailUrl,
        short DurationMin,
        byte ProgressPct,
        DateTime LastWatchedAt
    );
}
