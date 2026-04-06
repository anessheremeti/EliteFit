using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class UserGoal : BaseEntity
    {
        public int UserId { get; set; }
        public int GoalId { get; set; }

        public User? User { get; set; }
        public Goal? Goal { get; set; }
    }
}
