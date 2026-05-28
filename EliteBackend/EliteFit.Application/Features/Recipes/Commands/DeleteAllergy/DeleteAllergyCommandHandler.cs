using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.DeleteAllergy
{
    public class DeleteAllergyCommandHandler : IRequestHandler<DeleteAllergyCommand, Unit>
    {
        private readonly IAllergyAdminRepository _allergyRepository;

        public DeleteAllergyCommandHandler(IAllergyAdminRepository allergyRepository)
        {
            _allergyRepository = allergyRepository;
        }

        public async Task<Unit> Handle(DeleteAllergyCommand request, CancellationToken cancellationToken)
        {
            var allergy = await _allergyRepository.GetByIdAsync(request.Id, cancellationToken);

            if (allergy == null)
            {
                throw new KeyNotFoundException($"Alergjia me ID {request.Id} nuk u gjet.");
            }

            _allergyRepository.Delete(allergy);
            await _allergyRepository.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
