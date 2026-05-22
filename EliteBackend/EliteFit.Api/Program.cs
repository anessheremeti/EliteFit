using EliteFit.Application;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Infrastructure;
using EliteFit.Persistence;
using EliteFit.Persistence.Persistence.Context;
using EliteFit.Persistence.Repositories;
using EliteFit.Persistence.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Give in-flight requests up to 10 s to complete before the port is released.
// Without this, CTRL+C kills the socket mid-request and the OS keeps it in
// TIME_WAIT, causing "address already in use" on the next dotnet run.
builder.Host.ConfigureHostOptions(o => o.ShutdownTimeout = TimeSpan.FromSeconds(10));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

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

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddPersistenceServices();

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 0))
    )
);

builder.Services.AddSingleton<MongoDbContext>();

var jwtSection = builder.Configuration.GetSection("Jwt");
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
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSection["Secret"]!))
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Seed workout categories, videos, and plans on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var seedLogger = scope.ServiceProvider.GetRequiredService<ILogger<WorkoutSeedService>>();
    // uploads/ lives at the solution root, one level above the Api project
    var uploadsRoot = Path.GetFullPath(
        Path.Combine(app.Environment.ContentRootPath, "..", "uploads"));
    var seeder = new WorkoutSeedService(db, uploadsRoot, seedLogger);
    await seeder.SeedAsync();
}

// Seed recipes with allergen tags
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var seedLogger = scope.ServiceProvider.GetRequiredService<ILogger<RecipeSeedService>>();
    var seeder = new RecipeSeedService(db, seedLogger);
    await seeder.SeedAsync();
}

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

// Serve MP4s and thumbnails from the uploads folder
var uploadsPath = Path.GetFullPath(
    Path.Combine(app.Environment.ContentRootPath, "..", "uploads"));
if (Directory.Exists(uploadsPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(uploadsPath),
        RequestPath = "/uploads",
        OnPrepareResponse = ctx =>
        {
            ctx.Context.Response.Headers["Cache-Control"] = "public,max-age=86400";
            ctx.Context.Response.Headers["Access-Control-Allow-Origin"] = "*";
        }
    });
}

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
