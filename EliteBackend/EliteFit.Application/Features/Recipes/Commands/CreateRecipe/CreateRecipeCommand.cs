using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Commands.CreateRecipe
{
    public class CreateRecipeCommand : IRequest<int>
    {
        public string Title { get; set; } = string.Empty;
        public string? Instructions { get; set; }
        public int? Calories { get; set; }
        public decimal? ProteinG { get; set; }
        public decimal? CarbsG { get; set; }
        public decimal? FatG { get; set; }
        public int? ImageFileId { get; set; }
        public List<int> AllergenIds { get; set; } = new();
    }
}
