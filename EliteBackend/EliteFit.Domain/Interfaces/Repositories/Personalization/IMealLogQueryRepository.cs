using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Interfaces.Repositories.Personalization
{
    public interface IMealLogQueryRepository
    {
        Task<int> GetTotalCaloriesConsumedAsync(int userId, DateTime date, CancellationToken cancellationToken);
    }
}
