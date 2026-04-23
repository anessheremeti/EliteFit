using EliteFit.Domain.Interfaces.Services;
using EliteFit.Infrastructure.Services;
using EliteFit.Infrastructure.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EliteFit.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JwtSettings>(configuration.GetSection("Jwt"));
            services.AddScoped<IPasswordService, PasswordService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            return services;
        }
    }
}
