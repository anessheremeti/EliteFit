
using MediatR;

namespace EliteFit.Application.Features.Personalization.Command
{
    public class CalculateDailyTargetCommand : IRequest<int>
    {
        public int UserId { get; set; }
        public decimal WeightKg { get; set; }
        public decimal HeightCm { get; set; }
        public int WorkoutsPerWeek { get; set; }
    }
}