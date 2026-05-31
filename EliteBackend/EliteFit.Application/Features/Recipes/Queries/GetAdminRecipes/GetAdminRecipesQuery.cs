using EliteFit.Application.DTOs.Recipes.command;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Queries.GetAdminRecipes
{
    public class GetAdminRecipesQuery : IRequest<List<AdminRecipeDto>>
    {
        // Fjalë kyçe për të kërkuar recetën sipas titullit
        public string? SearchTerm { get; set; }

        // Numri i faqes aktuale (Default: 1)
        public int PageNumber { get; set; } = 1;

        // Sa receta do të shfaqen për faqe (Default: 10)
        public int PageSize { get; set; } = 10;
    }
}
