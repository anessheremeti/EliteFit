using EliteFit.Application.Features.Personalization.Command;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Repositories.Personalization; // Ndryshoje nëse namespace i ndërfaqes sate është ndryshe
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Personalization.Command
{
    public class CompleteOnboardingCommandHandler : IRequestHandler<CompleteOnboardingCommand, bool>
    {
        private readonly IUserProfileRepository _userProfileRepository;

        public CompleteOnboardingCommandHandler(IUserProfileRepository userProfileRepository)
        {
            _userProfileRepository = userProfileRepository;
        }

        public async Task<bool> Handle(CompleteOnboardingCommand request, CancellationToken cancellationToken)
        {
            // 1. Krijojmë një profil të ri
            var profile = new UserProfile
            {
                UserId = request.UserId,
                Gender = request.Gender,
                Age = request.Age,
                WeightKg = request.WeightKg,
                HeightCm = request.HeightCm,
                WorkoutsPerWeek = request.WorkoutsPerWeek,
                DietType = request.DietType,
                OnboardingCompleted = true
            };

            // 2. E shtojmë direkt si rresht të ri (INSERT)
            // Sigurohu që AddAsync e ke definuar siç diskutuam më herët
            await _userProfileRepository.AddAsync(profile);

            // 3. Ruajmë ndryshimet
            await _userProfileRepository.SaveChangesAsync();

            return true;
        }
    }
}