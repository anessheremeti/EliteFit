using EliteFit.Application.Features.Users.Commands.UpdateUserAllergies;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.UpdateUserAllergies
{
    public class UpdateUserAllergiesCommandHandler : IRequestHandler<UpdateUserAllergiesCommand, Unit>
    {
        private readonly IUserRepository _userRepository;

        public UpdateUserAllergiesCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Unit> Handle(UpdateUserAllergiesCommand request, CancellationToken cancellationToken)
        {
            // 1. Tani kjo metodë ekziston dhe e kryen punën bashkë me CancellationToken
            var user = await _userRepository.GetUserWithAllergiesAsync(request.UserId, cancellationToken);

            if (user == null)
            {
                throw new KeyNotFoundException($"Përdoruesi me ID {request.UserId} nuk u gjet.");
            }

            // 2. Pastro listën e vjetër
            user.UserAllergies.Clear();

            // 3. Shto të rejat
            if (request.AllergyIds != null && request.AllergyIds.Any())
            {
                user.UserAllergies = request.AllergyIds.Select(allergyId => new UserAllergy
                {
                    UserId = request.UserId,
                    AllergyId = allergyId
                }).ToList();
            }

            // 4. Update ekziston, dhe SaveChangesAsync() thirret pa argumente ashtu siç e ke në repo
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            return Unit.Value;
        }
    }
}