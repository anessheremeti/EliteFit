namespace EliteFit.Application.DTOs.Badges
{
    public record BadgeSummaryDto(
        int TotalEarned,
        int TotalBadges,
        int TotalPoints,
        int CompletionPct,
        IEnumerable<string> Categories
    );
}
