using EliteFit.Application.Features.Personalization.Command;
using EliteFit.Domain.Entities; // Sigurohu që e ke namespace-in e saktë për UserProfile
using EliteFit.Domain.Interfaces.Repositories.Personalization;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Personalization.Queries.Onboarding
{
    public class CalculateDailyTargetCommandHandler : IRequestHandler<CalculateDailyTargetCommand, int>
    {
        private readonly IUserProfileQueryRepository _userProfileRepository;

        public CalculateDailyTargetCommandHandler(IUserProfileQueryRepository userProfileRepository)
        {
            _userProfileRepository = userProfileRepository;
        }

        public async Task<int> Handle(CalculateDailyTargetCommand request, CancellationToken cancellationToken)
        {
            if (request.UserId <= 0)
                throw new ArgumentException("Id e përdoruesit e pavlefshme.");

            // 1. Tërheqim profilin ekzistues
            var profile = await _userProfileRepository.GetUserProfileAsync(request.UserId, cancellationToken);

            bool isNewProfile = false;

            // NËSE PROFILI NUK EKZISTON ENDE (Rast i shpeshtë në Onboarding), E KRIJOJMË NJE OBJEKT TË RI
            if (profile == null)
            {
                isNewProfile = true;
                profile = new UserProfile
                {
                    UserId = request.UserId,
                    Age = 25,         // Vlerë standarde default nëse nuk e dimë moshën ende
                    Gender = "male"   // Vlerë standarde default
                };
            }

            int age = profile.Age ?? 25;
            string gender = profile.Gender?.ToLower() ?? "male";

            // 2. Kalkulimi i BMR (Mifflin-St Jeor)
            decimal bmr;
            if (gender == "female")
            {
                bmr = 10m * request.WeightKg + 6.25m * request.HeightCm - 5m * age - 161m;
            }
            else
            {
                bmr = 10m * request.WeightKg + 6.25m * request.HeightCm - 5m * age + 5m;
            }

            // 3. Përcaktimi i Koeficientit të Aktivitetit
            decimal activityMultiplier;
            if (request.WorkoutsPerWeek == 0)
                activityMultiplier = 1.2m;
            else if (request.WorkoutsPerWeek <= 2)
                activityMultiplier = 1.375m;
            else if (request.WorkoutsPerWeek <= 4)
                activityMultiplier = 1.55m;
            else
                activityMultiplier = 1.725m;

            int calculatedCalorieTarget = (int)Math.Round(bmr * activityMultiplier);

            if (calculatedCalorieTarget < 1200) calculatedCalorieTarget = 1200;

            // 4. Ruajtja e të dhënave të reja në objekt
            profile.WeightKg = request.WeightKg;
            profile.HeightCm = request.HeightCm;
            profile.DailyCalorieTarget = calculatedCalorieTarget;

            // RUAJTJA APO PËRDITËSIMI NË BAZË TË SITUATËS
            if (isNewProfile)
            {
                // Nëse nuk e ke këtë metodë në repository, mund ta shtosh ose ta lejosh vetëm si update nëse profilin e krijon dikush tjetër gjatë Register-it.
                // Për siguri, po supozojmë që po përdorim të njëjtën metodë të përditësuar:
                await _userProfileRepository.UpdateUserProfileAsync(profile, cancellationToken);
            }
            else
            {
                await _userProfileRepository.UpdateUserProfileAsync(profile, cancellationToken);
            }

            return calculatedCalorieTarget;
        }
    }
}