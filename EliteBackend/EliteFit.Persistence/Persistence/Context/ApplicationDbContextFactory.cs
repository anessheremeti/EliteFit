using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace EliteFit.Persistence.Persistence.Context
{
    // Used exclusively by the EF Core CLI (dotnet ef migrations add …).
    // There is no HTTP context at design time, so a no-op accessor is injected.
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), "..", "EliteFit.Api");

            var configuration = new ConfigurationBuilder()
                .SetBasePath(path)
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options, new HttpContextAccessor());
        }
    }
}
