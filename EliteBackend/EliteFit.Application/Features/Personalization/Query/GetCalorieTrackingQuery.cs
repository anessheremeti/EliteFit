using EliteFit.Application.DTOs.Personalization;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Personalization.Query
{
    public class GetCalorieTrackingQuery : IRequest<CalorieTrackingDto>
    {
        public int UserId { get; set; }
        public DateTime TargetDate { get; set; }
    }
}
