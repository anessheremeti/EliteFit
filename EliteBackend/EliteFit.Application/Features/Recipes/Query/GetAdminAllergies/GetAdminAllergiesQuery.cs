using EliteFit.Application.DTOs.Recipes.command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Query.GetAdminAllergies
{
    public class GetAdminAllergiesQuery : IRequest<List<AdminAllergyDto>>
    {
        public string? SearchTerm { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
