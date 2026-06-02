using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Recipes.Command
{
    public interface IRealTimeNotificationService
    {
        Task SendNotificationToUserAsync(int userId, string title, string message);

        Task SendNotificationToAllAsync(string title, string message);
    }
}
