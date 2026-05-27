using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.DeleteAllergy
{
    public class DeleteAllergyCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }
}
