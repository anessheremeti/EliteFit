namespace EliteFit.Domain.Interfaces.Repositories.Recipes.Command
{
    public interface IRealTimeNotificationService
    {
        Task SendNotificationToUserAsync(int userId, string title, string message, string type = "system");
        Task SendNotificationToAllAsync(string title, string message, string type = "system");
    }
}
