using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class RecipeAllergenInfo : BaseEntity
    {
        public int RecipeId { get; set; }
        public int AllergyId { get; set; }

        public Recipe? Recipe { get; set; }
        public Allergy? Allergy { get; set; }
    }
}
