using System;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Interfaces.Repositories.Reports;
using MediatR;
using OfficeOpenXml;

namespace EliteFit.Application.Features.Reports.Queries.ExportWorkoutHistoryExcel
{
    public class ExportWorkoutHistoryExcelQueryHandler : IRequestHandler<ExportWorkoutHistoryExcelQuery, byte[]>
    {
        private readonly IReportRepository _repository;

        public ExportWorkoutHistoryExcelQueryHandler(IReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<byte[]> Handle(ExportWorkoutHistoryExcelQuery request, CancellationToken cancellationToken)
        {
            // Marrim të dhënat nga Repository
            var histories = await _repository.GetWorkoutHistoryReportAsync(
                request.FromDate, request.ToDate, request.CategoryId, cancellationToken);

            // Konfigurimi i LicenseContext për EPPlus (OfficeOpenXml)
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Historiku");

                // Titujt e kolonave
                worksheet.Cells[1, 1].Value = "ID";
                worksheet.Cells[1, 2].Value = "Email i Përdoruesit";
                worksheet.Cells[1, 3].Value = "Video e Ushtrimit";
                worksheet.Cells[1, 4].Value = "Kaloritë e Djegura";
                worksheet.Cells[1, 5].Value = "Koha (Sekonda)";
                worksheet.Cells[1, 6].Value = "Data e Kompletimit";

                worksheet.Cells[1, 1, 1, 6].Style.Font.Bold = true;

                // Mbushja e rreshtave nga databaza
                int row = 2;
                foreach (var item in histories)
                {
                    worksheet.Cells[row, 1].Value = item.Id;
                    worksheet.Cells[row, 2].Value = item.User?.Email ?? "Pa Email";
                    worksheet.Cells[row, 3].Value = item.Video?.Title ?? "Video e fshirë";
                    worksheet.Cells[row, 4].Value = item.CaloriesBurned ?? 0;
                    worksheet.Cells[row, 5].Value = item.TimeWatchedSeconds ?? 0;
                    worksheet.Cells[row, 6].Value = item.CompletedAt?.ToString("dd/MM/yyyy HH:mm") ?? "-";
                    row++;
                }

                if (worksheet.Dimension != null)
                {
                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
                }

                return package.GetAsByteArray();
            }
        }
    }
}