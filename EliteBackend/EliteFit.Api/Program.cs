using EliteFit.Application;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Query;
using EliteFit.Infrastructure;
using EliteFit.Persistence;
using EliteFit.Persistence.Persistence.Context;
using EliteFit.Persistence.Repositories;
using EliteFit.Persistence.Repositories.Recipes.Command;
using EliteFit.Persistence.Repositories.Recipes.Query;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using MongoDB.Driver; // Siguron që IMongoClient të jetë i disponueshëm

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

// Repositories ekzistuese dhe të reja
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddScoped<IRecipesQueryRepositories, RecipesQueryRepositories>();
builder.Services.AddScoped<IRecipeAdminRepository, RecipeAdminRepository>(); // Regjistruar për komandat e recetave
builder.Services.AddScoped<IAllergyAdminRepository, AllergyAdminRepository>();

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
                Encoding.UTF8.GetBytes(jwtSection["Secret"] ?? "Zevendeso_Me_Nje_Key_Te_Sigurt_Nese_Eshte_Bosh")) // Parandalon crash nëse Secret është bosh përkohësisht
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

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