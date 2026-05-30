using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Personalization
{
    public class SmartRecipeDto
    {
        public  int Id { get; set; } 
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public int? Calories { get; set; }
        public decimal? Protein { get; set; }
        public decimal? Carbs { get; set; }
        public decimal? Fat { get; set; }
    }
}
