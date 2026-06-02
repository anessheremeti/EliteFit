using EliteFit.Application.DTOs.Gamification;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.Streak
{
    public class StreakCommandHandler :
           IRequestHandler<UpdateStreakCommand, bool>,
           IRequestHandler<GetUserStreakQuery, UserStreakDto?>
    {
        private readonly IUserStreakRepository _repository;
        private readonly IRealTimeNotificationService _notificationService;

        public StreakCommandHandler(IUserStreakRepository repository, IRealTimeNotificationService notificationService)
        {
            _repository = repository;
            _notificationService = notificationService;
        }

        public async Task<bool> Handle(UpdateStreakCommand request, CancellationToken cancellationToken)
        {
            var streak = await _repository.GetByUserIdAsync(request.UserId, cancellationToken);
            var today = DateTime.UtcNow.Date;
            bool streakIncreased = false;

            if (streak == null) return false;

            if (streak.LastActivityDate.HasValue && streak.LastActivityDate.Value.Date == today)
            {
                // Përdoruesi ka kryer aktivitet sot, nuk ka nevojë të rritet sërish
                return true;
            }

            if (streak.LastActivityDate.HasValue && streak.LastActivityDate.Value.Date == today.AddDays(-1))
            {
                // Aktivitet i vazhdueshëm (dje dhe sot) -> Rritet streak
                streak.CurrentStreak = (streak.CurrentStreak ?? 0) + 1;
                streakIncreased = true;
            }
            else
            {
                // Ka shkëputje, por meqë po kryen aktivitet tani, streak bëhet 1
                streak.CurrentStreak = 1;
            }

            // Përditëso streak-un më të lartë nëse kalohet
            if (streak.CurrentStreak > (streak.HighestStreak ?? 0))
            {
                streak.HighestStreak = streak.CurrentStreak;
            }

            streak.LastActivityDate = DateTime.UtcNow;
            streak.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(streak, cancellationToken);

            // Dërgojmë njoftim WebSocket nëse përdoruesi vazhdon serinë mbi 1 ditë
            if (streakIncreased && streak.CurrentStreak > 1)
            {
                await _notificationService.SendNotificationToUserAsync(
                    request.UserId,
                    "Ditë e suksesshme! 🔥",
                    $"Ju keni një seri (streak) prej {streak.CurrentStreak} ditësh rresht! Vazhdoni kështu!"
                );
            }

            return true;
        }

        public async Task<UserStreakDto?> Handle(GetUserStreakQuery request, CancellationToken cancellationToken)
        {
            var streak = await _repository.GetByUserIdAsync(request.UserId, cancellationToken);
            if (streak == null) return null;

            return new UserStreakDto
            {
                UserId = streak.UserId,
                CurrentStreak = streak.CurrentStreak ?? 0,
                HighestStreak = streak.HighestStreak ?? 0,
                StreakFreezeCount = streak.StreakFreezeCount ?? 0,
                LastActivityDate = streak.LastActivityDate
            };
        }
    }
}