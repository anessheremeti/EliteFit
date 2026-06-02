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

namespace EliteFit.Application.Features.Gamification.Command.Goals
{
    public class GoalsCommandHandler :
            IRequestHandler<GetAllGoalsQuery, List<GoalDto>>,
            IRequestHandler<GetUserGoalsQuery, List<GoalDto>>,
            IRequestHandler<AssignGoalsToUserCommand, bool>
    {
        private readonly IGoalRepository _repository;
        private readonly IRealTimeNotificationService _notificationService;

        public GoalsCommandHandler(IGoalRepository repository, IRealTimeNotificationService notificationService)
        {
            _repository = repository;
            _notificationService = notificationService;
        }

        public async Task<List<GoalDto>> Handle(GetAllGoalsQuery request, CancellationToken cancellationToken)
        {
            var goals = await _repository.GetAllGoalsAsync(cancellationToken);
            return goals.Select(g => new GoalDto { Id = g.Id, Name = g.Name }).ToList();
        }

        public async Task<List<GoalDto>> Handle(GetUserGoalsQuery request, CancellationToken cancellationToken)
        {
            var userGoals = await _repository.GetUserGoalsAsync(request.UserId, cancellationToken);
            return userGoals.Select(ug => new GoalDto
            {
                Id = ug.GoalId,
                Name = ug.Goal?.Name ?? "Unknown"
            }).ToList();
        }

        public async Task<bool> Handle(AssignGoalsToUserCommand request, CancellationToken cancellationToken)
        {
            // 1. Fshijmë qëllimet e vjetra për ta përditësuar pastër listën
            await _repository.ClearUserGoalsAsync(request.UserId, cancellationToken);

            if (request.GoalIds == null || !request.GoalIds.Any()) return true;

            // 2. Shtojmë lidhjet e reja në tabelë
            var newGoals = request.GoalIds.Select(id => new EliteFit.Domain.Entities.UserGoal
            {
                UserId = request.UserId,
                GoalId = id
            }).ToList();

            await _repository.AddUserGoalsAsync(newGoals, cancellationToken);

            // 3. Dërgimi i njoftimit në kohë reale përmes WebSocket
            await _notificationService.SendNotificationToUserAsync(
                request.UserId,
                "Qëllime të reja 🎯",
                "Ju janë caktuar qëllime të reja për stërvitjet tuaja!"
            );

            return true;
        }
    }
}