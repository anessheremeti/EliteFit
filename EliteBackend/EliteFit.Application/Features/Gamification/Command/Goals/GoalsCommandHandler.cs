using EliteFit.Application.DTOs.Gamification;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using EliteFit.Domain.Interfaces.Services; // <-- SHTUAR: Për INotificationService
using EliteFit.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.Goals
{
    public record CreateGoalCommand(string Name) : IRequest<GoalDto>;

    // Komanda për të bërë Update (Kthen true/false)
    public record UpdateGoalCommand(int Id, string Name) : IRequest<bool>;

    // Komanda për të fshirë (Kthen true/false)
    public record DeleteGoalCommand(int Id) : IRequest<bool>;

    public class GoalsCommandHandler :
            IRequestHandler<GetAllGoalsQuery, List<GoalDto>>,
            IRequestHandler<GetUserGoalsQuery, List<GoalDto>>,
            IRequestHandler<AssignGoalsToUserCommand, bool>,
            // SHTUAR: Lidhjet për Create, Update, Delete
            IRequestHandler<CreateGoalCommand, GoalDto>,
            IRequestHandler<UpdateGoalCommand, bool>,
            IRequestHandler<DeleteGoalCommand, bool>
    {
        private readonly IGoalRepository _repository;
        private readonly INotificationService _notificationService; // <-- NDRYSHUAR Tipi

        public GoalsCommandHandler(IGoalRepository repository, INotificationService notificationService) // <-- NDRYSHUAR Konstruktori
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
            // 1. Fshijmë qëllimet e vjetra
            await _repository.ClearUserGoalsAsync(request.UserId, cancellationToken);

            if (request.GoalIds == null || !request.GoalIds.Any()) return true;

            // 2. Shtojmë lidhjet e reja
            var newGoals = request.GoalIds.Select(id => new EliteFit.Domain.Entities.UserGoal
            {
                UserId = request.UserId,
                GoalId = id
            }).ToList();

            await _repository.AddUserGoalsAsync(newGoals, cancellationToken);

            // 3. Njoftimi 
            // <-- NDRYSHUAR në SendNotificationAsync njëlloj si te Badge
            await _notificationService.SendNotificationAsync(
                request.UserId,
                "Qëllime të reja 🎯",
                "Ju janë caktuar qëllime të reja për stërvitjet tuaja!"
            );

            return true;
        }

        // =====================================================================
        // METODAT E REJA PËR CRUD (SHTO, NDRYSHO, FSHIJ)
        // =====================================================================

        public async Task<GoalDto> Handle(CreateGoalCommand request, CancellationToken cancellationToken)
        {
            var newGoal = new Goal // Supozojmë që Entiteti yt quhet Goal
            {
                Name = request.Name
            };

            await _repository.AddGoalAsync(newGoal, cancellationToken);

            return new GoalDto { Id = newGoal.Id, Name = newGoal.Name };
        }

        public async Task<bool> Handle(UpdateGoalCommand request, CancellationToken cancellationToken)
        {
            // Krijo objektin për përditësim
            var goalToUpdate = new Goal
            {
                Id = request.Id,
                Name = request.Name
            };

            await _repository.UpdateGoalAsync(goalToUpdate, cancellationToken);
            return true;
        }

        public async Task<bool> Handle(DeleteGoalCommand request, CancellationToken cancellationToken)
        {
            await _repository.DeleteGoalAsync(request.Id, cancellationToken);
            return true;
        }
    }
}