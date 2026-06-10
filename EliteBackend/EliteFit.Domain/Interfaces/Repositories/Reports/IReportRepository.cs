using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Entities; // <--- Tani përdorim Entities

namespace EliteFit.Domain.Interfaces.Repositories.Reports
{
    public interface IReportRepository
    {
        // Tani kthen listën e historikut direkt nga Domain
        Task<List<UserWorkoutHistory>> GetWorkoutHistoryReportAsync(
            string userId,
            DateTime? fromDate,
            DateTime? toDate,
            int? categoryId,
            CancellationToken cancellationToken);
    }
}