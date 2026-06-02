using EliteFit.Application.DTOs.Gamification;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.Streak
{
    public class StreakCommandHandler :
           IRequestHandler<UpdateStreakCommand, bool>,
           IRequestHandler<GetUserStreakQuery, UserStreakDto?>
    {
        private readonly IUserStreakRepository _repository;

        public StreakCommandHandler(IUserStreakRepository repository)
        {
            _repository = repository;
        }

        // Thirret kur useri bën një aktivitet (stërvitje, login, etj.)
        public async Task<bool> Handle(UpdateStreakCommand request, CancellationToken cancellationToken)
        {
            var streak = await _repository.GetByUserIdAsync(request.UserId, cancellationToken);
            var today = DateTime.UtcNow.Date;

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
