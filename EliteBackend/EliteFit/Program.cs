using EliteFit.Domain.Interfaces;
using EliteFit.Persistence.Context;
using EliteFit.Persistence.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Shërbime bazë të ASP.NET Core
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Regjistrojmë repository-et në DI (Dependency Injection)
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();

// Lidhja me MySQL përmes Entity Framework Core
// ServerVersion.AutoDetect e gjen vetë versionin e MySQL-it nga connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

///Lidhja me sql
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
 //   options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Regjistrojmë MongoDbContext si Singleton (një instancë për gjithë aplikacionin)
// IMongoClient nuk regjistrohet veçmas sepse MongoDbContext e krijon vetë klientin brenda
builder.Services.AddSingleton<MongoDbContext>();

// CORS - lejojmë kërkesat nga çdo origjinë (i nevojshëm për frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Endpoint testues për MongoDB - përdorim [FromServices] sepse MongoDbContext
// merret nga DI, jo nga body i kërkesës
app.MapGet("/test-mongo", ([FromServices] MongoDbContext mongo) =>
{
    try
    {
        var _ = mongo.AuditLogs;
        return "MongoDB Connected ✅";
    }
    catch
    {
        return "MongoDB Failed ❌";
    }
});

// Endpoint testues për MySQL
app.MapGet("/test-mysql", async (ApplicationDbContext db) =>
{
    return await db.Database.CanConnectAsync()
        ? "MySQL Connected ✅"
        : "MySQL Failed ❌";
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // Ridrejtojmë "/" te "/swagger" që kur hapim localhost të shohim Swagger UI
    // (pa këtë, faqja ishte bosh)
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

// Hequm UseHttpsRedirection() sepse kishte konfigurim të gabuar:
// HttpsPort ishte vendosur 5193 (porti HTTP), duke shkaktuar loop ridrejtimi
// dhe faqja nuk ngarkohej fare

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
