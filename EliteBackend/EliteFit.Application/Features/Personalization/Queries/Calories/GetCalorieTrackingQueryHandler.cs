using EliteFit.Application.DTOs.Personalization;
using EliteFit.Domain.Interfaces.Repositories.Personalization;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Personalization.Queries.Calories
{
    public class GetCalorieTrackingQueryHandler : IRequestHandler<GetCalorieTrackingQuery, CalorieTrackingDto>
    {
        private readonly IUserProfileQueryRepository _userProfileRepository;
        private readonly IMealLogQueryRepository _mealLogRepository;
        private readonly IWorkoutVideoRepository _workoutVideoRepository; // Injekto repozitorin e stërvitjeve

        public GetCalorieTrackingQueryHandler(
            IUserProfileQueryRepository userProfileRepository,
            IMealLogQueryRepository mealLogRepository,
            IWorkoutVideoRepository workoutRepository)
        {
            _userProfileRepository = userProfileRepository;
            _mealLogRepository = mealLogRepository;
            _workoutVideoRepository = workoutRepository;
        }

        public async Task<CalorieTrackingDto> Handle(GetCalorieTrackingQuery request, CancellationToken cancellationToken)
        {
            var dailyTarget = await _userProfileRepository.GetDailyCalorieTargetAsync(request.UserId, cancellationToken);
            var totalConsumed = await _mealLogRepository.GetTotalCaloriesConsumedAsync(request.UserId, request.TargetDate, cancellationToken);

            // Marrja e të dhënave të reja nga DB
            var totalWorkouts = await _workoutVideoRepository.GetCountByUserIdAsync(request.UserId, cancellationToken);
            var totalHours = await _workoutVideoRepository.GetTotalHoursByUserIdAsync(request.UserId, cancellationToken);
            var streak = await _workoutVideoRepository.GetCurrentStreakAsync(request.UserId, cancellationToken);

            return new CalorieTrackingDto
            {
                UserId = request.UserId,
                Date = request.TargetDate.Date,
                DailyTargetCalories = dailyTarget ?? 0,
                ConsumedCalories = totalConsumed,
                TotalWorkouts = totalWorkouts,
                TotalTrainingHours = (int)totalHours,
                CurrentStreak = streak
            };
        }
    }
}
