using EliteFit.Application.Common;
using EliteFit.Application.Features.Commands.Auth;
using EliteFit.Application.Validators;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace EliteFit.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddMediatR(typeof(RegisterCommandHandler).Assembly);
            services.AddValidatorsFromAssembly(typeof(RegisterValidator).Assembly);
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            return services;
        }
    }
}
