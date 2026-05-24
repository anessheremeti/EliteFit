using EliteFit.Domain.Interfaces.services;
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
            services.Configure<EmailSettings>(configuration.GetSection("Email"));
            services.AddScoped<IPasswordService, PasswordService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IEmailService, EmailService>();

            services.AddScoped<IFileStorageService, FileStorageService>();
            return services;
        }
    }
}
