using EliteFit.Application.DTOs.Recipes.command;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Query.GetAdminAllergies
{
    public class GetAdminAllergiesQueryHandler : IRequestHandler<GetAdminAllergiesQuery, List<AdminAllergyDto>>
    {
        private readonly IAllergyAdminRepository _allergyRepository;

        public GetAdminAllergiesQueryHandler(IAllergyAdminRepository allergyRepository)
        {
            _allergyRepository = allergyRepository;
        }

        public async Task<List<AdminAllergyDto>> Handle(GetAdminAllergiesQuery request, CancellationToken cancellationToken)
        {
            var allergies = await _allergyRepository.GetAllForAdminAsync(
                request.SearchTerm,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            return allergies.Select(a => new AdminAllergyDto
            {
                Id = a.Id,
                Name = a.Name,
                Description = a.Description
            }).ToList();
        }
    }
}
