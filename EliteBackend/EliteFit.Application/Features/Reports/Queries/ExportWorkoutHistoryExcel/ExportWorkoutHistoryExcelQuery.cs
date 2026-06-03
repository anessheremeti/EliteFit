using System;
using MediatR;

namespace EliteFit.Application.Features.Reports.Queries.ExportWorkoutHistoryExcel
{
    public record ExportWorkoutHistoryExcelQuery(
        DateTime? FromDate,
        DateTime? ToDate,
        int? CategoryId) : IRequest<byte[]>;
}