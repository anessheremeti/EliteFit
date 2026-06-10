using MediatR;

namespace EliteFit.Application.Features.Personalization.Command
{
    public class CompleteOnboardingCommand : IRequest<bool>
    {
        public int UserId { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
        public decimal WeightKg { get; set; }
        public decimal HeightCm { get; set; }

        public int WorkoutsPerWeek { get; set; }
        public string DietType { get; set; }   // Stringu i dietës (omnivore, vegan, etj.)
    }
}