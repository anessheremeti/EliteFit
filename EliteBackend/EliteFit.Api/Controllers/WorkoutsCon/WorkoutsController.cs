using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EliteFit.Application.Features.Workouts.Queries;
using EliteFit.Application.Features.Workouts.Commands;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public WorkoutsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("videos")]
        public async Task<IActionResult> GetVideos([FromQuery] GetWorkoutVideosQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("videos")]
        public async Task<IActionResult> CreateVideo([FromForm] CreateWorkoutVideoCommand command)
        {
            // command.UploaderId duhet të jetë marrë nga User-i i loguar
            var result = await _mediator.Send(command);
            return Ok(new { id = result });
        }

        // KJO ËSHTË METODA E RE QË DUHET TA SHTOSH:
        [HttpPost("complete-video")]
        public async Task<IActionResult> CompleteVideo([FromBody] CompleteWorkoutVideoCommand command)
        {
            var result = await _mediator.Send(command);

            if (!result)
            {
                // Nëse videoja nuk ekziston në databazë, kthejmë 404 NotFound
                return NotFound(new { message = "Videoja stërvitore nuk u gjet!" });
            }

            // Nëse çdo gjë shkon mirë dhe ruhet historiku së bashku me kaloritë e llogaritura
            return Ok(new { message = "Historiku u regjistrua dhe kaloritë u llogaritën me sukses!" });
        }
    }
}