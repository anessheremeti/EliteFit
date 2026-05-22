using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Query;
using EliteFit.Persistence.Repositories;
using EliteFit.Persistence.Repositories.Recipes.Command;
using EliteFit.Persistence.Repositories.Recipes.Query;
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
            services.AddScoped<IWorkoutRepository, WorkoutRepository>();
            services.AddScoped<IWorkoutVideoRepository, WorkoutVideoRepository>();
            services.AddScoped<IRecipesQueryRepositories, RecipesQueryRepositories>();
            services.AddScoped<IRecipesCommandRepositories, RecipesCommandRepositories>();
            services.AddScoped<IExerciseLogRepository, ExerciseLogRepository>();
            services.AddScoped<IRecipeRepository, RecipeRepository>();
            return services;
        }
    }
}
