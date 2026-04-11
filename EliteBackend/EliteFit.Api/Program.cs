using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Persistence.Context;
using EliteFit.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. SHTO SHËRBIMET (Add services to the container)

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
// 2. KONFIGURIMI I SQL SERVER (Entity Framework)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. KONFIGURIMI I MONGODB
// Regjistrohet si Singleton sepse nevojitet vetëm një instancë e klientit për tërë aplikacionin
builder.Services.AddSingleton<MongoDbContext>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
