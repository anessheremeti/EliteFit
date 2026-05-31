using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Interfaces.Repositories.Reports;
using MediatR;

namespace EliteFit.Application.Features.Reports.Queries
{
    // 1. Kërkesa (Query)
    public record ExportWorkoutHistoryPdfQuery(
        DateTime? FromDate,
        DateTime? ToDate,
        int? CategoryId) : IRequest<byte[]>;

    // 2. Logjika (Handler)
    public class ExportWorkoutHistoryPdfQueryHandler : IRequestHandler<ExportWorkoutHistoryPdfQuery, byte[]>
    {
        private readonly IReportRepository _repository;

        public ExportWorkoutHistoryPdfQueryHandler(IReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<byte[]> Handle(ExportWorkoutHistoryPdfQuery request, CancellationToken cancellationToken)
        {
            var histories = await _repository.GetWorkoutHistoryReportAsync(
                request.FromDate, request.ToDate, request.CategoryId, cancellationToken);

            var html = new StringBuilder();
            html.Append(@"
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 30px; }
                        h2 { text-align: center; color: #1e293b; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 14px; }
                        th { background-color: #0f172a; color: white; }
                        tr:nth-child(even) { background-color: #f8fafc; }
                    </style>
                </head>
                <body>
                    <h2>EliteFit — Raporti i Historikut të Ushtrimeve</h2>
                    <table>
                        <tr>
                            <th>Email</th>
                            <th>Video</th>
                            <th>Kalori</th>
                            <th>Kohëzgjatja</th>
                            <th>Data</th>
                        </tr>");

            foreach (var item in histories)
            {
                html.Append("<tr>");
                html.Append($"<td>{item.User?.Email ?? "Pa Email"}</td>");
                html.Append($"<td>{item.Video?.Title ?? "Video e fshirë"}</td>");
                html.Append($"<td>{item.CaloriesBurned ?? 0} kcal</td>");
                html.Append($"<td>{item.TimeWatchedSeconds ?? 0}s</td>");
                html.Append($"<td>{item.CompletedAt?.ToString("dd/MM/yyyy HH:mm") ?? "-"}</td>");
                html.Append("</tr>");
            }

            html.Append("</table></body></html>");

            return Encoding.UTF8.GetBytes(html.ToString());
        }
    }
}