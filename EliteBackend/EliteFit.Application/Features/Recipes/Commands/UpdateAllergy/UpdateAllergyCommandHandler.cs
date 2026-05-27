using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.UpdateAllergy
{
    public class UpdateAllergyCommandHandler : IRequestHandler<UpdateAllergyCommand, Unit>
    {
        private readonly IAllergyAdminRepository _allergyRepository;

        public UpdateAllergyCommandHandler(IAllergyAdminRepository allergyRepository)
        {
            _allergyRepository = allergyRepository;
        }

        public async Task<Unit> Handle(UpdateAllergyCommand request, CancellationToken cancellationToken)
        {
            var allergy = await _allergyRepository.GetByIdAsync(request.Id, cancellationToken);

            if (allergy == null)
            {
                throw new KeyNotFoundException($"Alergjia me ID {request.Id} nuk ekziston.");
            }

            allergy.Name = request.Name;
            allergy.Description = request.Description;

            _allergyRepository.Update(allergy);
            await _allergyRepository.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
