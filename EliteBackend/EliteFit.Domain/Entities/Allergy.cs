using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class Allergy : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; } =String.Empty;
        public ICollection<UserAllergy> UserAllergies { get; set; } = new List<UserAllergy>();
    }
}
