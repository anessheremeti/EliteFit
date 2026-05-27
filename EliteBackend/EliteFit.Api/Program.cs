using EliteFit.Application;
using EliteFit.Application.Common.Behaviors;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Query; // Shtuar për Interface-in e ri
using EliteFit.Infrastructure;
using EliteFit.Persistence;
using EliteFit.Persistence.Persistence.Context;
using EliteFit.Persistence.Repositories;
using EliteFit.Persistence.Repositories.Recipes.Query; // Shtuar për Klasën e re të MongoDB
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver; // Shtuar për IMongoClient
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// -------------------------------------------------------------------
// SHËRBIMET BAZË DHE SWAGGER
// -------------------------------------------------------------------
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

// -------------------------------------------------------------------
// SHTRESAT E ARKITEKTURËS ONION & CACHING
// -------------------------------------------------------------------
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddPersistenceServices();

// Aktivizimi i Memories Distributed për Caching (Përballon 1000+ kërkesa)
builder.Services.AddDistributedMemoryCache();

// Regjistrimi i Pipeline Behavior në MediatR për Caching automatik
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(CachingBehavior<,>));

// -------------------------------------------------------------------
// REGJISTRIMI I REPOSITORIES (SQL & MONGODB)
// -------------------------------------------------------------------
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();

// REGJISTRIMI I REPOSITORY-T TË RI PËR LEXIM NGA MONGODB
builder.Services.AddScoped<IRecipesQueryRepositories, RecipesQueryRepositories>();

// -------------------------------------------------------------------
// KONFIGURIMI I DATABAZAVE (MySQL/SQL Server & MongoDB)
// -------------------------------------------------------------------

// A) Relational Database (MySQL ose SQL Server)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 0))
    )
);

// Shënim për SQL Server (Nëse ndërrohet në të ardhmen):
// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//      options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// B) MongoDB Config (Rregulluar plotësisht me injektim parametrash)
var mongoConnectionString = builder.Configuration.GetValue<string>("MongoSettings:ConnectionString") ?? "mongodb://localhost:27017";
var mongoDatabaseName = builder.Configuration.GetValue<string>("MongoSettings:DatabaseName") ?? "EliteFitReadDb";

// Regjistrojmë klientin zyrtar të MongoDB si Singleton
builder.Services.AddSingleton<IMongoClient>(new MongoClient(mongoConnectionString));

// Regjistrojmë Context-in e MongoDB duke i kaluar klientin dhe emrin e DB-së
builder.Services.AddScoped<MongoDbContext>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return new MongoDbContext(client, mongoDatabaseName);
});

// -------------------------------------------------------------------
// SECURITY (JWT & CORS)
// -------------------------------------------------------------------
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Secret"]!))
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// -------------------------------------------------------------------
// MIDDLEWARES DHE PIPELINE GLOBAL
// -------------------------------------------------------------------

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

// -------------------------------------------------------------------
// TEST ENDPOINTS (Për të parë nëse lidhen databazat)
// -------------------------------------------------------------------
app.MapGet("/test-mongo", ([Microsoft.AspNetCore.Mvc.FromServices] MongoDbContext mongo) =>
{
    try
    {
        // Provon të qaset te koleksioni i recetave për të vërtetuar lidhjen
        var _ = mongo.Recipe;
        return "MongoDB Connected ✅";
    }
    catch (Exception ex)
    {
        return $"MongoDB Failed ❌: {ex.Message}";
    }
});

app.MapGet("/test-mysql", async (ApplicationDbContext db) =>
    await db.Database.CanConnectAsync() ? "MySQL Connected ✅" : "MySQL Failed ❌");

// Swagger dhe ridrejtimi
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