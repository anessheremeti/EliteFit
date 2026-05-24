using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EliteFit.Application.Features.Queries.Workouts;
using EliteFit.Application.Features.Commands.Workouts;

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
    }

}
