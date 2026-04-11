using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace EliteFit.Persistence.Persistence.Context
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // 1. Gjejmë rrugën (path) deri te projekti API
            // Kjo shkon te folderi aktual (Persistence), kthehet një nivel prapa, dhe hyn te EliteFit.Api
            string path = Path.Combine(Directory.GetCurrentDirectory(), "..", "EliteFit.Api");

            // 2. Ndërtojmë konfigurimin duke lexuar appsettings.json
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(path)
                .AddJsonFile("appsettings.json")
                .Build();

            // 3. Marrim Connection String me emrin "DefaultConnection"
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}