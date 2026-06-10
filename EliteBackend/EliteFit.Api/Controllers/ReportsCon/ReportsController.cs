using System;
using System.Threading.Tasks;
using EliteFit.Application.Features.Reports.Queries.ExportWorkoutHistoryExcel;
using EliteFit.Application.Features.Reports.Queries.ExportWorkoutHistoryPdf;
using EliteFit.Application.Features.Reports.Queries.GetWorkoutHistoryReport;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ReportsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // 1. Shfaqja e historikut në tabelën e dashboard-it
       
[HttpGet("workout-history")]
public async Task<IActionResult> GetWorkoutHistory([FromQuery] string userId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] int? categoryId)
        {
            // Kalojmë userId (mund të jetë null)
            var query = new GetWorkoutHistoryReportQuery(userId, fromDate, toDate, categoryId);
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // 2. Eksportimi në Excel
        [HttpGet("workout-history/export/excel")]
        public async Task<IActionResult> ExportToExcel([FromQuery] string userId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] int? categoryId)
        {
            // Sigurohu që ExportWorkoutHistoryExcelQuery tani pranon userId në konstruktor
            var query = new ExportWorkoutHistoryExcelQuery(userId, fromDate, toDate, categoryId);
            byte[] fileBytes = await _mediator.Send(query);

            string fileName = $"Raporti_EliteFit_{DateTime.Now:yyyyMMdd}.xlsx";
            string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

            return File(fileBytes, contentType, fileName);
        }

        // 3. Eksportimi në PDF
        [HttpGet("workout-history/export/pdf")]
        public async Task<IActionResult> ExportToPdf([FromQuery] string userId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] int? categoryId)
        {
            try
            {
                // Sigurohu që ExportWorkoutHistoryPdfQuery tani pranon userId në konstruktor
                var query = new ExportWorkoutHistoryPdfQuery(userId, fromDate, toDate, categoryId);
                byte[] fileBytes = await _mediator.Send(query);

                string fileName = $"Raporti_EliteFit_{DateTime.Now:yyyyMMdd}.pdf";
                string contentType = "application/pdf";

                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                // Logimi i gabimit për debugging
                Console.WriteLine($"PDF Export Error: {ex.Message}");
                return StatusCode(500, $"Gabim në gjenerimin e PDF: {ex.Message}");
            }
        }
    }
}