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

namespace EliteFit.Application.Features.Gamification.Command.UserBadge
{
    public class BadgeTriggerEngineHandler :
            INotificationHandler<WorkoutCompletedEvent>,
            IRequestHandler<GetUserBadgesQuery, List<UserBadgeDto>>
    {
        private readonly IUserBadgeRepository _repository;
        private readonly IRealTimeNotificationService _notificationService;

        public BadgeTriggerEngineHandler(IUserBadgeRepository repository, IRealTimeNotificationService notificationService)
        {
            _repository = repository;
            _notificationService = notificationService;
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

                    // Njoftojmë direkt përdoruesin në ekran që sapo fitoi medaljen e re
                    await _notificationService.SendNotificationToUserAsync(
                        notification.UserId,
                        "Medalje e re e fituar! 🏆",
                        "Urime! Keni fituar medaljen për 10 stërvitje të përfunduara me sukses."
                    );
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