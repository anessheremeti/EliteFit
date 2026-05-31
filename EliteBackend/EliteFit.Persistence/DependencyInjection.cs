using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Repositories.Exercise;
using EliteFit.Domain.Interfaces.Repositories.Reports;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using EliteFit.Persistence.Repositories;
using EliteFit.Persistence.Repositories.Exercise;
using EliteFit.Persistence.Repositories.Reports;
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

            services.AddScoped<IReportRepository, ReportRepository>();

            services.AddScoped<IExerciseCategoryRepository, ExerciseCategoryRepository>();
            services.AddScoped<IWorkoutVideoRepository, WorkoutVideoRepository>();
            return services;
        }
    }
}
