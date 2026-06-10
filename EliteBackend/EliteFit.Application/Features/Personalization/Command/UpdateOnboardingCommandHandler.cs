using MediatR;
using EliteFit.Domain.Interfaces.Repositories;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Personalization.Command
{
    public class UpdateOnboardingCommandHandler : IRequestHandler<UpdateOnboardingCommand, bool>
    {
        private readonly IUserProfileRepository _userProfileRepository;

        public UpdateOnboardingCommandHandler(IUserProfileRepository userProfileRepository)
        {
            _userProfileRepository = userProfileRepository;
        }

        public async Task<bool> Handle(UpdateOnboardingCommand request, CancellationToken cancellationToken)
        {
            // 1. Gjejmë profilin ekzistues nga databaza
            var profile = await _userProfileRepository.GetByUserIdAsync(request.UserId);

            // Nëse përdoruesi nuk ka profil (p.sh. nuk e ka bërë onboarding asnjëherë), kthejmë false
            if (profile == null)
            {
                return false;
            }

            // 2. Mapojmë vlerat e reja mbi ato ekzistuese
            profile.Gender = request.Gender;
            profile.Age = request.Age;
            profile.WeightKg = request.WeightKg;
            profile.HeightCm = request.HeightCm;
            profile.WorkoutsPerWeek = request.WorkoutsPerWeek;
            profile.DietType = request.DietType;

            // 3. Ekzekutojmë përditësimin dhe ruajmë ndryshimet
            await _userProfileRepository.UpdateUserProfileAsync(profile, cancellationToken);
            await _userProfileRepository.SaveChangesAsync();

            return true;
        }
    }
}