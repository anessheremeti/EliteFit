using System;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Interfaces.Repositories.Reports;
using MediatR;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace EliteFit.Application.Features.Reports.Queries.ExportWorkoutHistoryPdf
{
    public class ExportWorkoutHistoryPdfQueryHandler : IRequestHandler<ExportWorkoutHistoryPdfQuery, byte[]>
    {
        private readonly IReportRepository _repository;

        public ExportWorkoutHistoryPdfQueryHandler(IReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<byte[]> Handle(ExportWorkoutHistoryPdfQuery request, CancellationToken cancellationToken)
        {
            // RREGULLIMI 1: Vendosja e rrugës së plotë për licencën komunitare
            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;
            var histories = await _repository.GetWorkoutHistoryReportAsync(
              request.UserId, request.FromDate, request.ToDate, request.CategoryId, cancellationToken);

            var pdfBytes = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);
                    page.Size(PageSizes.A4);
                    page.DefaultTextStyle(x => x.FontFamily(Fonts.Arial).FontSize(11));

                    // Header-i i Dokumentit
                    page.Header().Column(column =>
                    {
                        column.Item().Text("EliteFit — Raporti i Historikut të Ushtrimeve")
                            .FontSize(20)
                            .Bold()
                            .AlignCenter()
                            .FontColor("#1e293b");

                        column.Item().PaddingTop(10).LineHorizontal(1).LineColor("#cbd5e1");
                    });

                    // Tabela me të dhënat
                    page.Content().PaddingTop(20).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(2); // Email
                            columns.RelativeColumn(2); // Video
                            columns.RelativeColumn(1); // Kalori
                            columns.RelativeColumn(1); // Kohëzgjatja
                            columns.RelativeColumn(2); // Data
                        });

                        // Header-i i Tabelës
                        table.Header(header =>
                        {
                            header.Cell().Background("#0f172a").Padding(8).Text("Email").Bold().FontColor(Colors.White);
                            header.Cell().Background("#0f172a").Padding(8).Text("Video").Bold().FontColor(Colors.White);
                            header.Cell().Background("#0f172a").Padding(8).Text("Kalori").Bold().FontColor(Colors.White);
                            header.Cell().Background("#0f172a").Padding(8).Text("Kohëzgjatja").Bold().FontColor(Colors.White);
                            header.Cell().Background("#0f172a").Padding(8).Text("Data").Bold().FontColor(Colors.White);
                        });

                        // Rreshtat e Tabelës dynamically
                        bool isEven = false;
                        foreach (var item in histories)
                        {
                            var rowBg = isEven ? "#f8fafc" : "#ffffff";

                            table.Cell().Background(rowBg).Border(1).BorderColor("#cbd5e1").Padding(8).Text(item.User?.Email ?? "Pa Email");
                            table.Cell().Background(rowBg).Border(1).BorderColor("#cbd5e1").Padding(8).Text(item.Video?.Title ?? "Video e fshirë");
                            table.Cell().Background(rowBg).Border(1).BorderColor("#cbd5e1").Padding(8).Text($"{item.CaloriesBurned ?? 0} kcal");
                            table.Cell().Background(rowBg).Border(1).BorderColor("#cbd5e1").Padding(8).Text($"{item.TimeWatchedSeconds ?? 0}s");
                            table.Cell().Background(rowBg).Border(1).BorderColor("#cbd5e1").Padding(8).Text(item.CompletedAt?.ToString("dd/MM/yyyy HH:mm") ?? "-");

                            isEven = !isEven;
                        }
                    });

                    // Footer-i (Numri i faqeve)
                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.CurrentPageNumber();
                        // RREGULLIMI 2: Përdorimi i .Span() në vend të .Text() brenda TextDescriptor
                        x.Span(" / ");
                        x.TotalPages();
                    });
                });
            }).GeneratePdf();

            return pdfBytes;
        }
    }
}