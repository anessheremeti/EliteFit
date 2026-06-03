using System;
using MediatR;

namespace EliteFit.Application.Features.Reports.Queries.ExportWorkoutHistoryPdf
{
    public record ExportWorkoutHistoryPdfQuery(
        DateTime? FromDate,
        DateTime? ToDate,
        int? CategoryId) : IRequest<byte[]>;
}