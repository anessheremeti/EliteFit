using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Recipes.command
{
    public class AdminRecipeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? Calories { get; set; }
        public decimal? ProteinG { get; set; }
        public List<int> AllergenIds { get; set; } = new();
    }
}
