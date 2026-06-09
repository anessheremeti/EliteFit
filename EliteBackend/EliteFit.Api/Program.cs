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
using tusdotnet;
using tusdotnet.Models;
using tusdotnet.Models.Configuration;
using tusdotnet.Stores;

var builder = WebApplication.CreateBuilder(args);

// ===================================================================
// KONFIGURIMI I LIMITIT TË MADHËSISË SË SKEDARËVE
// ===================================================================
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 524288000; // 500 * 1024 * 1024 bytes
});

builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = 524288000; // 500 MB
    options.MultipartHeadersLengthLimit = int.MaxValue;
});
// ===================================================================

// Shërbime bazë
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();

// Swagger me mbështetje për JWT
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EliteFit API", Version = "v1" });
    c.MapType<System.IO.Stream>(() => new OpenApiSchema { Type = "string", Format = "binary" });
    c.MapType<Microsoft.AspNetCore.Http.IFormFile>(() => new OpenApiSchema { Type = "string", Format = "binary" });
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

// SignalR
builder.Services.AddSignalR();
builder.Services.AddScoped<IRealTimeNotificationService, RealTimeNotificationService>();

// Regjistrimi i shërbimit në prapavijë për Streak
builder.Services.AddHostedService<StreakBackgroundWorker>();

// SQL Server (Entity Framework Core)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// MONGODB
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

// JWT Authentication
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

// CORS i përditësuar për të mbështetur saktë React dhe Tus Headers
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()
              .WithExposedHeaders("Upload-Key", "X-Context-Id", "Location", "Upload-Offset", "Upload-Length", "Tus-Version", "Tus-Resumable", "Tus-Extension", "Tus-Max-Size"));
});

var app = builder.Build();

// Seed default data
using (var seedScope = app.Services.CreateScope())
{
    var db = seedScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await EliteFit.Persistence.DataSeeder.SeedAsync(db);
}

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
            : exception?.InnerException != null
                ? $"{exception.Message} -> DETALET E DB: {exception.InnerException.Message}"
                : exception?.Message ?? "An unexpected error occurred.";

        await context.Response.WriteAsJsonAsync(new { message });
    });
});

// ===================================================================
// RENDITJA JODIKE: CORS duhet të thirret para Tus Middleware që të kapë Preflight Requests
// ===================================================================
app.UseCors("AllowReactApp");


// Kjo i thotë .NET-it: Kur dikush kërkon /uploads/..., shko kërkoje në disk tek ky folder


app.UseStaticFiles(); // Kjo shërben gjithçka në wwwroot
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});
// --- KRIJIMI AUTOMATIK I FOLDERIT NËSE MUNGON NË DISK ---
var tusTempPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads", "tus_temp");
if (!Directory.Exists(tusTempPath))
{
    Directory.CreateDirectory(tusTempPath);
}
// --------------------------------------------------------

// ===================================================================
// KONFIGURIMI I TUS MIDDLEWARE 
// ===================================================================
app.UseTus(httpContext => new DefaultTusConfiguration
{
    Store = new TusDiskStore(tusTempPath),
    UrlPath = "/api/upload-chunks",
    Events = new Events
    {
        OnFileCompleteAsync = async ctx =>
        {
            var file = await ctx.GetFileAsync();
            var fileContent = await file.GetContentAsync(ctx.CancellationToken);
            Console.WriteLine($"Video {file.Id} u ngarkua e plotë dhe pa bllokuar rrjetin.");
        }
    }
});
// ===================================================================

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

// Renditja e mbetur e Middleware-ve
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();