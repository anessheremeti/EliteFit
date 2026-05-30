using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Personalization
{
    public class CalorieTrackingDto
    {
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public int DailyTargetCalories { get; set; }
        public int ConsumedCalories { get; set; }
        public int RemainingCalories => DailyTargetCalories - ConsumedCalories;
        public double NetProgressPercentage
        {
            get
            {
                if (DailyTargetCalories <= 0) return 0;
                var percentage = ((double)ConsumedCalories / DailyTargetCalories) * 100;
                return Math.Round(percentage, 2);
            }
        }
        public string EnergyStatus => RemainingCalories >= 0 ? "Brenda normës" : "Tejkalim i normës";
    }
}
