using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class MealLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
        public int CaloriesConsumed { get; set; }
        public DateTime LogDate { get; set; }
        public User User { get; set; } = null!;
        public Recipe Recipe { get; set; } = null!;
    }
}
