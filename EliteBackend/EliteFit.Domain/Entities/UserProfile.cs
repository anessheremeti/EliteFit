using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class UserProfile
    {
        public int UserId { get; set; }
        public string Gender { get; set; }
        public decimal? WeightKg { get; set; }
        public decimal? HeightCm { get; set; }

        public int? WorkoutsPerWeek { get; set; }
        public int? MealsPerDay { get; set; }

        public string DietType { get; set; }
        public bool? OnboardingCompleted { get; set; }
        public int? DailyCalorieTarget { get; set; }

        public User User { get; set; }
    }
}
