using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace EliteFit.Persistence
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
            services.AddScoped<IAllergyRepository, AllergyRepository>();
            services.AddScoped<IGoalRepository, GoalRepository>();
            services.AddScoped<IUserProfileRepository, UserProfileRepository>();
            return services;
        }
    }
}
