using EliteFit.Application.DTOs.Personalization;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Personalization.Query
{
    public class GetSmartRecipesQuery : IRequest<List<SmartRecipeDto>>
    {
        public int UserId { get; set; }
        public int? MaxCalories { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
