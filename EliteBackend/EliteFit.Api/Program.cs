using EliteFit.Application;
using EliteFit.Domain.Authorization;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Infrastructure.Authorization;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using EliteFit.Domain.Interfaces.Repositories.Personalization;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Queries;
using EliteFit.Infrastructure;
using EliteFit.Infrastructure.BackgroundServices;
using EliteFit.Infrastructure.Services;
using EliteFit.Persistence;
using EliteFit.Persistence.Persistence.Context;
using EliteFit.Persistence.Repositories;
using EliteFit.Persistence.Repositories.Gamification.Command;
using EliteFit.Persistence.Repositories.Personalization.Queries;
using EliteFit.Persistence.Repositories.Recipes.Command;
using EliteFit.Persistence.Repositories.Recipes.Queries;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver; // Siguron që IMongoClient të jetë i disponueshëm
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Shërbime bazë
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger me mbështetje për JWT
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EliteFit API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

// Shtresat e arkitekturës Onion
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddPersistenceServices();

// Permission-based authorization policies
// Registered here (not in Infrastructure) to use the framework-provided
// AddAuthorization and avoid NuGet package version conflicts.
builder.Services.AddAuthorization(options =>
{
    foreach (var permission in Permissions.All())
        options.AddPolicy(permission, policy =>
            policy.Requirements.Add(new PermissionRequirement(permission)));
});

// Repositories ekzistuese dhe të reja
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddScoped<IRecipesQueryRepositories, RecipesQueryRepositories>();
builder.Services.AddScoped<IRecipeAdminRepository, RecipeAdminRepository>(); // Regjistruar për komandat e recetave
builder.Services.AddScoped<IAllergyAdminRepository, AllergyAdminRepository>();
builder.Services.AddScoped<IUserProfileQueryRepository, UserProfileQueryRepository>();
builder.Services.AddScoped<IMealLogQueryRepository, MealLogQueryRepository>();
builder.Services.AddScoped<IRecipesSmartQueryRepository, RecipesSmartQueryRepository>();
builder.Services.AddScoped<ISettingRepository, SettingRepository>();
builder.Services.AddScoped<IUserBadgeRepository, UserBadgeRepository>();
builder.Services.AddScoped<IUserStreakRepository, UserStreakRepository>();
builder.Services.AddScoped<EliteFit.Domain.Interfaces.Repositories.Gamification.IGoalRepository, EliteFit.Persistence.Repositories.Gamification.Command.GoalRepository>();

builder.Services.AddScoped<EliteFit.Domain.Interfaces.Repositories.IGoalRepository, EliteFit.Persistence.Repositories.GoalRepository>();
// 1. Shto Shërbimet e SignalR dhe regjistro ndërfaqen tënde
builder.Services.AddSignalR();
builder.Services.AddScoped<IRealTimeNotificationService, RealTimeNotificationService>();

// (Më poshtë, pas app.UseRouting() dhe app.UseAuthorization())

// Regjistrimi i shërbimit në prapavijë për Streak
builder.Services.AddHostedService<StreakBackgroundWorker>();
// MySQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 0))
    )
);

// -------------------------------------------------------------------
// ZONA E KOLEGËVE - SQL Server (Entity Framework Core)
// -------------------------------------------------------------------
// builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// -------------------------------------------------------------------

// ==========================================
// RREGULLIMI PËR MONGODB (Duke u bazuar në appsettings tuaj)
// ==========================================

// 1. Regjistrojmë IMongoClient si Singleton
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    // Lexon "mongodb://localhost:27017" direkt nga objekti "MongoDbSettings"
    var connectionString = builder.Configuration["MongoDbSettings:ConnectionString"]
        ?? "mongodb://localhost:27017";
    return new MongoClient(connectionString);
});

// 2. Regjistrojmë MongoDbContext duke kaluar parametrat që pret konstruktori (client, string)
builder.Services.AddSingleton<MongoDbContext>(sp =>
{
    var mongoClient = sp.GetRequiredService<IMongoClient>();

    // Lexon "EliteFitLogDb" direkt nga objekti "MongoDbSettings"
    var databaseName = builder.Configuration["MongoDbSettings:DatabaseName"] ?? "EliteFitLogDb";

    return new MongoDbContext(mongoClient, databaseName);
});

// JWT Authentication
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtSecret = jwtSection["Secret"];
if (string.IsNullOrWhiteSpace(jwtSecret))
    throw new InvalidOperationException(
        "Jwt:Secret is not configured. Add it to appsettings.Development.json.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };

        // SignalR WebSocket connections cannot send Authorization headers;
        // the client passes the token via ?access_token= query string instead.
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                    context.Token = accessToken;
                return Task.CompletedTask;
            }
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Seed default roles, permissions and role-permission mappings on startup
using (var seedScope = app.Services.CreateScope())
{
    var db = seedScope.ServiceProvider.GetRequiredService<EliteFit.Persistence.Persistence.Context.ApplicationDbContext>();
    await EliteFit.Persistence.DataSeeder.SeedAsync(db);
}

// Global exception handler — kthen mesazhe të qarta për frontend
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        context.Response.ContentType = "application/json";

        context.Response.StatusCode = exception switch
        {
            InvalidOperationException => StatusCodes.Status400BadRequest,
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            ValidationException => StatusCodes.Status422UnprocessableEntity,
            _ => StatusCodes.Status500InternalServerError
        };

        var message = exception is ValidationException ve
            ? string.Join("; ", ve.Errors.Select(e => e.ErrorMessage))
            : exception?.Message ?? "An unexpected error occurred.";

        await context.Response.WriteAsJsonAsync(new { message });
    });
});
app.MapHub<EliteFit.Infrastructure.SignalR.NotificationHub>("/hubs/notifications");

// Test endpoints
app.MapGet("/test-mongo", ([Microsoft.AspNetCore.Mvc.FromServices] MongoDbContext mongo) =>
{
    try { var _ = mongo.AuditLogs; return "MongoDB Connected ✅"; }
    catch { return "MongoDB Failed ❌"; }
});

app.MapGet("/test-mysql", async (ApplicationDbContext db) =>
    await db.Database.CanConnectAsync() ? "MySQL Connected ✅" : "MySQL Failed ❌");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();