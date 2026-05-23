using EliteFit.Application.DTOs.Badges;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Badges
{
    public record GetUserBadgesQuery(int UserId, string? Category = null) : IRequest<BadgeGalleryDto>;

    public class GetUserBadgesQueryHandler : IRequestHandler<GetUserBadgesQuery, BadgeGalleryDto>
    {
        private readonly IBadgeRepository _repo;
        public GetUserBadgesQueryHandler(IBadgeRepository repo) => _repo = repo;

        public async Task<BadgeGalleryDto> Handle(GetUserBadgesQuery req, CancellationToken ct)
        {
            var allBadges  = (await _repo.GetAllActiveAsync()).ToList();
            var userBadges = (await _repo.GetUserBadgesAsync(req.UserId)).ToList();
            var metrics    = await _repo.GetUserMetricsAsync(req.UserId);

            // Mutable state for the current request (separate from DB state)
            var earnedMap = userBadges.ToDictionary(ub => ub.BadgeId, ub => (
                Earned:        ub.EarnedAt.HasValue,
                EarnedAt:      ub.EarnedAt,
                ProgressCount: ub.ProgressCount
            ));

            var updates = new List<(int BadgeId, int ProgressCount, bool Earned)>();

            // ── Pass 1: all non-PointsEarned badges ──────────────────────────────
            foreach (var badge in allBadges.Where(b => b.TriggerType != "PointsEarned"))
            {
                if (earnedMap.TryGetValue(badge.Id, out var state) && state.Earned) continue;

                var rawProgress = ComputeRawProgress(badge, metrics);
                var isEarned    = rawProgress >= badge.TriggerThreshold;
                var capped      = Math.Min(rawProgress, badge.TriggerThreshold);
                var prevProgress = state.ProgressCount;

                if (isEarned || capped != prevProgress)
                {
                    updates.Add((badge.Id, capped, isEarned));
                    earnedMap[badge.Id] = (isEarned, isEarned ? DateTime.UtcNow : null, capped);
                }
            }

            // ── Pass 2: PointsEarned badges (need earned points from Pass 1) ────
            var pointsSoFar = allBadges
                .Where(b => earnedMap.TryGetValue(b.Id, out var s) && s.Earned)
                .Sum(b => b.Points);

            foreach (var badge in allBadges.Where(b => b.TriggerType == "PointsEarned"))
            {
                if (earnedMap.TryGetValue(badge.Id, out var state) && state.Earned) continue;

                var isEarned = pointsSoFar >= badge.TriggerThreshold;
                if (isEarned)
                {
                    updates.Add((badge.Id, badge.TriggerThreshold, true));
                    earnedMap[badge.Id] = (true, DateTime.UtcNow, badge.TriggerThreshold);
                }
            }

            // Persist any new awards / progress changes
            if (updates.Count > 0)
            {
                await _repo.UpsertUserBadgesAsync(req.UserId, updates);
                await _repo.SaveChangesAsync();
            }

            // ── Build DTOs for all badges ─────────────────────────────────────────
            var allDtos = allBadges.Select(b => BuildDto(b, metrics, earnedMap)).ToList();

            // Summary is always based on the full catalog (not filtered)
            var earnedDtos  = allDtos.Where(d => d.Status == "earned").ToList();
            var totalPoints = allBadges
                .Where(b => earnedDtos.Any(d => d.Id == b.Id))
                .Sum(b => b.Points);

            var completionPct = allBadges.Count > 0
                ? (int)Math.Round((double)earnedDtos.Count / allBadges.Count * 100)
                : 0;

            var categories = new[] { "All" }
                .Concat(allBadges.Select(b => b.Category).Distinct().Order())
                .ToList();

            var summary = new BadgeSummaryDto(
                earnedDtos.Count, allBadges.Count, totalPoints, completionPct, categories);

            // Apply optional category filter for the badge list
            var filteredDtos = string.IsNullOrEmpty(req.Category) || req.Category == "All"
                ? allDtos
                : allDtos.Where(d => d.Category == req.Category).ToList();

            return new BadgeGalleryDto(summary, filteredDtos);
        }

        // ── Helpers ───────────────────────────────────────────────────────────────

        private static int ComputeRawProgress(Badge badge, BadgeUserMetrics m) =>
            badge.TriggerType switch
            {
                "WorkoutsCompleted" => m.WorkoutsCompleted,
                "CaloriesBurned"    => (int)Math.Min(badge.TriggerThreshold, m.CaloriesBurned),
                "StreakDays"        => m.CurrentStreak,
                "ProfileCompleted"  => m.ProfileCompleted ? 1 : 0,
                _                   => 0   // Manual, PointsEarned (handled separately)
            };

        private static BadgeDto BuildDto(
            Badge badge,
            BadgeUserMetrics metrics,
            Dictionary<int, (bool Earned, DateTime? EarnedAt, int ProgressCount)> earnedMap)
        {
            if (earnedMap.TryGetValue(badge.Id, out var state) && state.Earned)
            {
                return new BadgeDto(badge.Id, badge.Name, badge.Description,
                    badge.Category, badge.TriggerType, badge.TriggerThreshold,
                    badge.Tier, badge.Points, badge.IsSecret,
                    badge.IconEmoji, badge.Color,
                    "earned", state.EarnedAt, state.ProgressCount, 100);
            }

            var rawProgress  = earnedMap.TryGetValue(badge.Id, out var inProg)
                ? inProg.ProgressCount
                : ComputeRawProgress(badge, metrics);

            var progressPct = badge.TriggerThreshold > 0
                ? (int)Math.Min(99, Math.Round((double)rawProgress / badge.TriggerThreshold * 100))
                : 0;

            var status = rawProgress > 0 ? "in_progress" : "locked";

            // Secret badges reveal nothing until earned
            if (badge.IsSecret)
            {
                return new BadgeDto(badge.Id, "???",
                    "Keep training to unlock this secret achievement.",
                    badge.Category, badge.TriggerType, badge.TriggerThreshold,
                    badge.Tier, badge.Points, true, "🔒", "#6B7280",
                    status, null, rawProgress, progressPct);
            }

            return new BadgeDto(badge.Id, badge.Name, badge.Description,
                badge.Category, badge.TriggerType, badge.TriggerThreshold,
                badge.Tier, badge.Points, badge.IsSecret,
                badge.IconEmoji, badge.Color,
                status, null, rawProgress, progressPct);
        }
    }
}
