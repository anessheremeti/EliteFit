using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class Setting : BaseEntity
    {
        public string Key { get; set; }
        public string? Value { get; set; }
        public string? Description { get; set; }
    }
}
