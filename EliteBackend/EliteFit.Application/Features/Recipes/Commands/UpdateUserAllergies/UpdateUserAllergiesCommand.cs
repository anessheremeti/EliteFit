using MediatR;
using System.Collections.Generic;

namespace EliteFit.Application.Features.Users.Commands.UpdateUserAllergies
{
    public class UpdateUserAllergiesCommand : IRequest<Unit>
    {
        // ID e userit (këtë do ta marrim nga Token-i në Controller, jo nga frontendi, për siguri)
        public int UserId { get; set; }

        // Lista e ID-ve të alergjive që useri ka bërë "Select" në frontend
        public List<int> AllergyIds { get; set; } = new();
    }
}