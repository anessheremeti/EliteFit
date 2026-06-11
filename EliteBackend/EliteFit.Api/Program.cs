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
using MongoDB.Driver;
using System.Text;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. SHËRBIMET BAZË & SHTRESAT (DI)
// ==========================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();

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

// Authorization Policies
builder.Services.AddAuthorization(options =>
{
    foreach (var permission in Permissions.All())
        options.AddPolicy(permission, policy =>
            policy.Requirements.Add(new PermissionRequirement(permission)));
});

// ==========================================
// 2. REGJISTRIMI I REPOSITORIES & SERVICES
// ==========================================
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddScoped<IRecipesQueryRepositories, RecipesQueryRepositories>();
builder.Services.AddScoped<IRecipeAdminRepository, RecipeAdminRepository>();
builder.Services.AddScoped<IAllergyAdminRepository, AllergyAdminRepository>();
builder.Services.AddScoped<IUserProfileQueryRepository, UserProfileQueryRepository>();
builder.Services.AddScoped<IMealLogQueryRepository, MealLogQueryRepository>();
builder.Services.AddScoped<IRecipesSmartQueryRepository, RecipesSmartQueryRepository>();
builder.Services.AddScoped<ISettingRepository, SettingRepository>();
builder.Services.AddScoped<IUserBadgeRepository, UserBadgeRepository>();
builder.Services.AddScoped<IUserStreakRepository, UserStreakRepository>();

builder.Services.AddScoped<EliteFit.Domain.Interfaces.Repositories.Gamification.IGoalRepository, EliteFit.Persistence.Repositories.Gamification.Command.GoalRepository>();
builder.Services.AddScoped<EliteFit.Domain.Interfaces.Repositories.IGoalRepository, EliteFit.Persistence.Repositories.GoalRepository>();

// SignalR & Notification Services
builder.Services.AddSignalR();
builder.Services.AddScoped<EliteFit.Domain.Interfaces.Services.INotificationService, EliteFit.Infrastructure.Services.SignalRNotificationService>();

// RREGULLIMI: Regjistrimi i shërbimit real-time që kërkohej nga StreakBackgroundWorker
builder.Services.AddScoped<IRealTimeNotificationService, RealTimeNotificationService>();

// Shërbimi në prapavijë (Background Worker)
builder.Services.AddHostedService<StreakBackgroundWorker>();

// MySQL Connection
var defaultConn = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(defaultConn, ServerVersion.AutoDetect(defaultConn)));

// MongoDB Connection
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var connectionString = builder.Configuration["MongoDbSettings:ConnectionString"] ?? "mongodb://localhost:27017";
    return new MongoClient(connectionString);
});

builder.Services.AddSingleton<MongoDbContext>(sp =>
{
    var mongoClient = sp.GetRequiredService<IMongoClient>();
    var databaseName = builder.Configuration["MongoDbSettings:DatabaseName"] ?? "EliteFitLogDb";
    return new MongoDbContext(mongoClient, databaseName);
});

// ==========================================
// 3. AUTENTIFIKIMI JWT & CORS
// ==========================================
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtSecret = jwtSection["Secret"];
if (string.IsNullOrWhiteSpace(jwtSecret))
    throw new InvalidOperationException("Jwt:Secret is not configured. Add it to appsettings.Development.json.");

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Build-imi i Aplikacionit
var app = builder.Build();

// ==========================================
// 4. DATA SEEDING AT STARTUP
// ==========================================
using (var seedScope = app.Services.CreateScope())
{
    var db = seedScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await EliteFit.Persistence.DataSeeder.SeedAsync(db);
}

// ==========================================
// 5. MIDDLEWARE PIPELINE (RENDITJA E SAKTË)
// ==========================================

// Global exception handler
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

// RREGULLIMI: Static Files ekzekutohet përpara rrugëzimeve kryesore
app.UseStaticFiles();

app.UseCors("AllowAll");
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// ==========================================
// 6. ENDPOINTS & MAPS
// ==========================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

// Test endpoints
app.MapGet("/test-mongo", ([Microsoft.AspNetCore.Mvc.FromServices] MongoDbContext mongo) =>
{
    try { var _ = mongo.AuditLogs; return "MongoDB Connected ✅"; }
    catch { return "MongoDB Failed ❌"; }
});

app.MapGet("/test-mysql", async (ApplicationDbContext db) =>
    await db.Database.CanConnectAsync() ? "MySQL Connected ✅" : "MySQL Failed ❌");

// Mapimi i Kontrollorëve dhe Hub-it të SignalR
app.MapControllers();
app.MapHub<EliteFit.Infrastructure.SignalR.NotificationHub>("/hubs/notifications");

app.Run();