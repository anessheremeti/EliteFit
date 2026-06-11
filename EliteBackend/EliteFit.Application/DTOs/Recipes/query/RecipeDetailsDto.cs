using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Recipes.query
{
    public class RecipeDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Instructions { get; set; }
        public int? Calories { get; set; }
        public decimal? ProteinG { get; set; }
        public decimal? CarbsG { get; set; }
        public decimal? FatG { get; set; }

        public string? ImageUrl { get; set; }
    }
}
