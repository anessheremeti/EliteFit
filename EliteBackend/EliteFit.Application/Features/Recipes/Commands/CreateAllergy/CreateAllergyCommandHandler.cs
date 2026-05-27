using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.CreateAllergy
{
    public class CreateAllergyCommandHandler : IRequestHandler<CreateAllergyCommand, int>
    {
        private readonly IAllergyAdminRepository _allergyRepository;

        public CreateAllergyCommandHandler(IAllergyAdminRepository allergyRepository)
        {
            _allergyRepository = allergyRepository;
        }

        public async Task<int> Handle(CreateAllergyCommand request, CancellationToken cancellationToken)
        {
            var allergy = new Allergy
            {
                Name = request.Name,
                Description = request.Description
            };

            await _allergyRepository.AddAsync(allergy, cancellationToken);
            await _allergyRepository.SaveChangesAsync(cancellationToken);

            return allergy.Id;
        }
    }
}
