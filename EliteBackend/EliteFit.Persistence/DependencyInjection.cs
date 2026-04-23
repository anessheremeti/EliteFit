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
            return services;
        }
    }
}
