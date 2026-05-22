namespace EliteFit.Application.DTOs.Badges
{
    public record BadgeDto(
        int Id,
        string Name,
        string? Description,
        string Category,
        string TriggerType,
        int TriggerThreshold,
        string Tier,
        int Points,
        bool IsSecret,
        string? IconEmoji,
        string? Color,
        string Status,          // "earned" | "in_progress" | "locked"
        DateTime? EarnedAt,
        int ProgressCount,
        int ProgressPct
    );
}
