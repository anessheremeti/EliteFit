using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.UpdateRecipe
{
    public class UpdateRecipeCommand : IRequest<Unit>
    {
        public int Id { get; set; } // Identifikuesi për update
        public string Title { get; set; } = string.Empty;
        public string? Instructions { get; set; }
        public int? Calories { get; set; }
        public decimal? ProteinG { get; set; }
        public decimal? CarbsG { get; set; }     // <-- Kjo mungonte
        public decimal? FatG { get; set; }       // <-- Kjo mungonte
        public int? ImageFileId { get; set; }    // <-- Kjo mungonte
        public List<int> AllergenIds { get; set; } = new();
    }
}
