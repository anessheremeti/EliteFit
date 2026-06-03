using System;
using System.Collections.Generic;
using EliteFit.Application.DTOs.Reports;
using MediatR;

namespace EliteFit.Application.Features.Reports.Queries.GetWorkoutHistoryReport
{
    public record GetWorkoutHistoryReportQuery(
        DateTime? FromDate,
        DateTime? ToDate,
        int? CategoryId) : IRequest<List<WorkoutHistoryReportDto>>;
}