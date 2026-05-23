namespace EliteFit.Application.DTOs.Workout
{
    public record WorkoutDto(
        int Id,
        string Title,
        string? Description,
        string? Category,
        string Difficulty,
        string? MuscleGroup,
        short DurationMin,
        string? ThumbnailUrl,
        bool IsFeatured,
        string? Label,
        int? VideoId = null,
        string? VideoUrl = null,
        string? VideoTitle = null
    );
}
