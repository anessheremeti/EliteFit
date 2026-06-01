using MediatR;
using System.Collections.Generic;

namespace EliteFit.Application.Features.Personalization.Queries.Onboarding
{
    public class CheckOnboardingStatusQuery : IRequest<OnboardingStatusDto>
    {
        public int UserId { get; set; }
    }

    public class OnboardingStatusDto
    {
        public bool IsOnboardingComplete { get; set; }
        public List<string> MissingFields { get; set; } = new();
    }
}