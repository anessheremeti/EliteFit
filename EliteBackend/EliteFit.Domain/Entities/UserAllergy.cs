using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class UserAllergy : BaseEntity
    {
        public int UserId { get; set; }
        public int AllergyId { get; set; }

        public User? User { get; set; }
        public Allergy? Allergy { get; set; }
    }
}
