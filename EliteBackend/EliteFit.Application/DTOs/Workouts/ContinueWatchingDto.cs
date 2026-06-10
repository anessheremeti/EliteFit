using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Workouts
{
    public class ContinueWatchingDto
    {
        public int ProgressId { get; set; }
        public string Title { get; set; }
     
        public int DurationMin { get; set; }
        public int ProgressPct { get; set; }
    }
}
