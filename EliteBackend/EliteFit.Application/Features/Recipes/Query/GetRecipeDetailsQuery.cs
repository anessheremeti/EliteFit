using EliteFit.Application.DTOs.Recipes.query;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Query
{
    public class GetRecipeDetailsQuery : IRequest<RecipeDetailsDto?>
    {
        public int Id { get; set; }
    }
}
