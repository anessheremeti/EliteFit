using System;
using System.Collections.Generic;

namespace EliteFit.Application.DTOs.Personalization
{
    public class CalorieTrackingDto
    {
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public int DailyTargetCalories { get; set; }
        public int ConsumedCalories { get; set; }
        public int RemainingCalories => DailyTargetCalories - ConsumedCalories;

        // Fushat e reja për Dashboard
        public int TotalWorkouts { get; set; }
        public int TotalTrainingHours { get; set; }
        public int CurrentStreak { get; set; }

        // Opsionale: ndryshimet (nëse i ke në backend)
        public int WorkoutChange { get; set; }
        public int TimeChange { get; set; }
    }

}