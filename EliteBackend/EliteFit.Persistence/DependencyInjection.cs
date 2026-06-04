using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Repositories.Exercise;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using EliteFit.Domain.Interfaces.Repositories.Media;
using EliteFit.Domain.Interfaces.Repositories.Personalization;
using EliteFit.Domain.Interfaces.Repositories.Reports;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using EliteFit.Domain.Interfaces.Services;
using EliteFit.Persistence.Repositories;
using EliteFit.Persistence.Repositories.Exercise;
using EliteFit.Persistence.Repositories.Gamification.Command;
using EliteFit.Persistence.Services;
using EliteFit.Persistence.Repositories.Media;
using EliteFit.Persistence.Repositories.Personalization.Queries;
using EliteFit.Persistence.Repositories.Reports;
using Microsoft.Extensions.DependencyInjection;

namespace EliteFit.Persistence
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IPermissionRepository, PermissionRepository>();
            services.AddScoped<IPermissionResolver, DbPermissionResolver>();
            services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
            services.AddScoped<IAllergyRepository, AllergyRepository>();
            services.AddScoped<EliteFit.Domain.Interfaces.Repositories.IGoalRepository, EliteFit.Persistence.Repositories.GoalRepository>();
            services.AddScoped<IUserProfileRepository, UserProfileRepository>();

            services.AddScoped<IReportRepository, ReportRepository>();

            services.AddScoped<IUserProfileQueryRepository, UserProfileQueryRepository>();
            services.AddScoped<IQuickFixTipRepository, QuickFixTipRepository>();
            services.AddScoped<IBadgeRepository, BadgeRepository>();
            services.AddScoped<ISettingRepository, SettingRepository>();

            services.AddScoped<IExerciseCategoryRepository, ExerciseCategoryRepository>();
            services.AddScoped<IWorkoutVideoRepository, WorkoutVideoRepository>();

            services.AddScoped<IBadgeRepository, BadgeRepository>();
            services.AddScoped<IQuickFixTipRepository, QuickFixTipRepository>();
            services.AddScoped<IFileRepository, FileRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();

            return services;
        }
    }
}
