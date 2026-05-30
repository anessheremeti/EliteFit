using EliteFit.Application.DTOs.Personalization;
using EliteFit.Domain.Interfaces.Repositories.Personalization;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Personalization.Query
{
    public class GetCalorieTrackingQueryHandler : IRequestHandler<GetCalorieTrackingQuery, CalorieTrackingDto>
    {
        private readonly IUserProfileQueryRepository _userProfileRepository;
        private readonly IMealLogQueryRepository _mealLogRepository;

        public GetCalorieTrackingQueryHandler(
            IUserProfileQueryRepository userProfileRepository,
            IMealLogQueryRepository mealLogRepository)
        {
            _userProfileRepository = userProfileRepository;
            _mealLogRepository = mealLogRepository;
        }

        public async Task<CalorieTrackingDto> Handle(GetCalorieTrackingQuery request, CancellationToken cancellationToken)
        {
            if (request.UserId <= 0)
            {
                throw new ArgumentException("Id e përdoruesit e pavlefshme.");
            }

            // 1. Nxirret synimi ditor i kalorive nga Profili i Përdoruesit (SQL)
            var dailyTarget = await _userProfileRepository.GetDailyCalorieTargetAsync(request.UserId, cancellationToken);
            if (!dailyTarget.HasValue)
            {
                throw new KeyNotFoundException($"Nuk u gjet asnjë synim ditor i kalorive për përdoruesit me ID {request.UserId}. Ju lutem konfiguroni profilin tuaj.");
            }

            // 2. Nxirret shuma e kalorive të konsumuara për datën specifike (SQL)
            var totalConsumed = await _mealLogRepository.GetTotalCaloriesConsumedAsync(request.UserId, request.TargetDate, cancellationToken);

            // 3. Kthehet objekti i plotë i përpunuar
            return new CalorieTrackingDto
            {
                UserId = request.UserId,
                Date = request.TargetDate.Date,
                DailyTargetCalories = dailyTarget.Value,
                ConsumedCalories = totalConsumed
            };
        }
    }
}
