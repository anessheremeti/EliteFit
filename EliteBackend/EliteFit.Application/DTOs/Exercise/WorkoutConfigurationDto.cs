using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Exercise
{
    public class WorkoutConfigurationDto
    {
        public List<LookupDto> DifficultyLevels { get; set; } = new List<LookupDto>();
        public List<LookupDto> MuscleGroups { get; set; } = new List<LookupDto>();
    }
}
