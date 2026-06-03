using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Reports;
using EliteFit.Domain.Interfaces.Repositories.Reports;
using MediatR;

namespace EliteFit.Application.Features.Reports.Queries.GetWorkoutHistoryReport
{
    public class GetWorkoutHistoryReportQueryHandler : IRequestHandler<GetWorkoutHistoryReportQuery, List<WorkoutHistoryReportDto>>
    {
        private readonly IReportRepository _repository;

        public GetWorkoutHistoryReportQueryHandler(IReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<WorkoutHistoryReportDto>> Handle(GetWorkoutHistoryReportQuery request, CancellationToken cancellationToken)
        {
            var histories = await _repository.GetWorkoutHistoryReportAsync(
                request.FromDate,
                request.ToDate,
                request.CategoryId,
                cancellationToken);

            // Mapimi i pastër i të dhënave që vijnë nga DB në DTO
            return histories.Select(h => new WorkoutHistoryReportDto
            {
                Id = h.Id,
                UserEmail = h.User?.Email ?? "Pa Email",
                VideoTitle = h.Video?.Title ?? "Video e fshirë",
                CategoryName = h.Video?.Category?.Name ?? "Pa Kategori",
                CaloriesBurned = h.CaloriesBurned ?? 0,
                TimeWatchedSeconds = h.TimeWatchedSeconds ?? 0,
                CompletedAt = h.CompletedAt ?? DateTime.MinValue
            }).ToList();
        }
    }
}