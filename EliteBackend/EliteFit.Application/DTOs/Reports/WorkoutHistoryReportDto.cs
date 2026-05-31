using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Reports
{
    public class WorkoutHistoryReportDto
    {
        public int Id { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string VideoTitle { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int CaloriesBurned { get; set; }
        public int TimeWatchedSeconds { get; set; }
        public DateTime CompletedAt { get; set; }
    }
}
