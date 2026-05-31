using EliteFit.Application.Features.Personalization.Query;
using EliteFit.Domain.Interfaces.Repositories.Personalization; // Përdor namespace tuaj të saktë për repository
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Personalization.Query
{
    public class CheckOnboardingStatusQueryHandler : IRequestHandler<CheckOnboardingStatusQuery, OnboardingStatusDto>
    {
        private readonly IUserProfileQueryRepository _userProfileRepository;

        public CheckOnboardingStatusQueryHandler(IUserProfileQueryRepository userProfileRepository)
        {
            _userProfileRepository = userProfileRepository;
        }

        public async Task<OnboardingStatusDto> Handle(CheckOnboardingStatusQuery request, CancellationToken cancellationToken)
        {
            if (request.UserId <= 0)
            {
                throw new ArgumentException("Id e përdoruesit e pavlefshme.");
            }

            var response = new OnboardingStatusDto();

            // 1. Tërheqim profilin e përdoruesit nga repository yt ekzistues
            var profile = await _userProfileRepository.GetUserProfileAsync(request.UserId, cancellationToken);
            // Shënim: Nëse emri i metodës ndryshon (p.sh GetByIdAsync), përshtatja emrin metodës që ke në repository

            if (profile == null)
            {
                response.IsOnboardingComplete = false;
                response.MissingFields.Add("profile_missing");
                return response;
            }

            // 2. Verifikimi i Peshës (weight_kg)
            if (profile.WeightKg == null || profile.WeightKg <= 0)
            {
                response.MissingFields.Add("pesha");
            }

            // 3. Verifikimi i Gjatësisë (height_cm)
            if (profile.HeightCm == null || profile.HeightCm <= 0)
            {
                response.MissingFields.Add("gjatësia");
            }

            // 4. Verifikimi i Qëllimeve (user_goals) - duke përdorur metodat ekzistuese të profilit
            var userAllergyIds = await _userProfileRepository.GetUserAllergyIdsAsync(request.UserId, cancellationToken);
            if (userAllergyIds == null || userAllergyIds.Count == 0)
            {
                response.MissingFields.Add("alergjitë");
            }

            // 5. Verifikimi i Qëllimeve (user_goals)
            var userGoalIds = await _userProfileRepository.GetUserGoalIdsAsync(request.UserId, cancellationToken);
            // Shënim: Nëse nuk e ke këtë metodë, shtoje në IUserProfileQueryRepository që të kthejë List<int> nga tabela user_goals
            if (userGoalIds == null || userGoalIds.Count == 0)
            {
                response.MissingFields.Add("qëllimet");
            }

            // Nëse nuk mungon asnjë fushë, onboarding është i kryer
            response.IsOnboardingComplete = response.MissingFields.Count == 0;

            return response;
        }
    }
}