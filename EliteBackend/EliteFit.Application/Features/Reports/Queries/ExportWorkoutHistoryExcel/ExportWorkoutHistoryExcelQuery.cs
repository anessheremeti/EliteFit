using System;
using MediatR;

namespace EliteFit.Application.Features.Reports.Queries.ExportWorkoutHistoryExcel
{
    public record ExportWorkoutHistoryExcelQuery(
        string UserId,
        DateTime? FromDate,
        DateTime? ToDate,
        int? CategoryId) : IRequest<byte[]>;
}