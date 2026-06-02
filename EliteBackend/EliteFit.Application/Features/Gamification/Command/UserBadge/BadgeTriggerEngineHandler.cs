using EliteFit.Application.DTOs.Gamification;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.UserBadge
{
    public class BadgeTriggerEngineHandler :
            INotificationHandler<WorkoutCompletedEvent>,
            IRequestHandler<GetUserBadgesQuery, List<UserBadgeDto>>
    {
        private readonly IUserBadgeRepository _repository;

        public BadgeTriggerEngineHandler(IUserBadgeRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(WorkoutCompletedEvent notification, CancellationToken cancellationToken)
        {
            int totalWorkouts = await _repository.GetWorkoutCountAsync(notification.UserId, cancellationToken);

            if (totalWorkouts >= 10)
            {
                int fitnessBadgeId = 1; 

                bool alreadyHasBadge = await _repository.HasBadgeAsync(notification.UserId, fitnessBadgeId, cancellationToken);

                if (!alreadyHasBadge)
                {
                    var newBadge = new EliteFit.Domain.Entities.UserBadge
                    {
                        UserId = notification.UserId,
                        BadgeId = fitnessBadgeId,
                        EarnedAt = DateTime.UtcNow
                    };

                    await _repository.AddUserBadgeAsync(newBadge, cancellationToken);
                }
            }
        }

        public async Task<List<UserBadgeDto>> Handle(GetUserBadgesQuery request, CancellationToken cancellationToken)
        {
            var userBadges = await _repository.GetBadgesByUserIdAsync(request.UserId, cancellationToken);

            return userBadges.Select(ub => new UserBadgeDto
            {
                Id = ub.Id,
                BadgeId = ub.BadgeId,
                BadgeName = ub.Badge?.Name ?? "Unknown",
                Description = ub.Badge?.Description,
                IconPath = ub.Badge?.BadgeIcon?.FilePath, 
                EarnedAt = ub.EarnedAt
            }).ToList();
        }
    }
}
