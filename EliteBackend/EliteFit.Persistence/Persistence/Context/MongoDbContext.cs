using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using EliteFit.Domain.Entities.Mongo;

namespace EliteFit.Persistence.Persistence.Context
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration configuration)
        {
            // Lexon stringun nga appsettings.json
            var connectionString = configuration.GetSection("MongoDbSettings:ConnectionString").Value;
            var databaseName = configuration.GetSection("MongoDbSettings:DatabaseName").Value;

            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        // Kjo na mundëson qasjen te tabela (Collection) e Log-eve
        public IMongoCollection<AuditLog> AuditLogs =>
            _database.GetCollection<AuditLog>("AuditLogs");
    }
}