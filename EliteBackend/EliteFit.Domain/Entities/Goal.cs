using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class Goal : BaseEntity
    {
        public string Name { get; set; }

        public ICollection<UserGoal> UserGoals { get; set; }
    }
}
