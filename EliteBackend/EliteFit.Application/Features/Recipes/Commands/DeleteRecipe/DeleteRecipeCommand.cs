using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.DeleteRecipe
{
    public class DeleteRecipeCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }
}
