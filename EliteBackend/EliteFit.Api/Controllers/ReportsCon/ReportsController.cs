using System;
using System.Threading.Tasks;
using EliteFit.Application.Features.Reports.Queries;
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

        
        [HttpGet("workout-history")]
        public async Task<IActionResult> GetWorkoutHistory([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] int? categoryId)
        {
          
            var query = new GetWorkoutHistoryReportQuery(fromDate, toDate, categoryId);

            var result = await _mediator.Send(query);

            return Ok(result);
        }
        [HttpGet("workout-history/export/excel")]
        public async Task<IActionResult> ExportToExcel([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] int? categoryId)
        {
            var query = new ExportWorkoutHistoryExcelQuery(fromDate, toDate, categoryId);
            byte[] fileBytes = await _mediator.Send(query);

            string fileName = $"Raporti_EliteFit_{DateTime.Now:yyyyMMdd}.xlsx";
            string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

            return File(fileBytes, contentType, fileName);
        }

        
        [HttpGet("workout-history/export/pdf")]
        public async Task<IActionResult> ExportToPdf([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] int? categoryId)
        {
            var query = new ExportWorkoutHistoryPdfQuery(fromDate, toDate, categoryId);
            byte[] fileBytes = await _mediator.Send(query);

            string fileName = $"Raporti_EliteFit_{DateTime.Now:yyyyMMdd}.pdf";
            string contentType = "application/pdf";

            return File(fileBytes, contentType, fileName);
        }
    }
}