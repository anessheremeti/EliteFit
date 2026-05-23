namespace EliteFit.Application.DTOs.Badges
{
    public record BadgeGalleryDto(
        BadgeSummaryDto Summary,
        IEnumerable<BadgeDto> Badges
    );
}
