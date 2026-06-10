using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Personalization.Command
{
    public class UpdateOnboardingCommand : IRequest<bool>
    {
        public int UserId { get; set; }
        public string Gender { get; set; } = string.Empty;
        public int Age { get; set; }

        // NDREJTO KËTU: Ndrysho nga double në decimal
        public decimal WeightKg { get; set; }
        public decimal HeightCm { get; set; }

        public int WorkoutsPerWeek { get; set; }
        public string DietType { get; set; } = string.Empty;
    }

   
}