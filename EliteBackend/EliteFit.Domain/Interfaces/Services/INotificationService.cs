namespace EliteFit.Domain.Interfaces.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(int userId, string title, string message);
    }
}
