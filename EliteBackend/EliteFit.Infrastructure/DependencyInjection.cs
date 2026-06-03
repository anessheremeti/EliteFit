using EliteFit.Domain.Interfaces.services;
using EliteFit.Domain.Interfaces.Services;
using EliteFit.Infrastructure.Authorization;
using EliteFit.Infrastructure.Services;
using EliteFit.Infrastructure.Settings;
using Microsoft.AspNetCore.Authorization;
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
            services.AddScoped<IAuditLogService, AuditLogService>();

            // Register the handler — policies are registered in Program.cs
            // to avoid a version conflict between the standalone Authorization
            // NuGet package and the one built into the ASP.NET Core 8 framework.
            services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();

            return services;
        }
    }
}
