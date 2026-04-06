using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class UserRole : BaseEntity
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public DateTime? AssignedAt { get; set; }

        public User? User { get; set; }
        public Role? Role { get; set; }
    }
}
