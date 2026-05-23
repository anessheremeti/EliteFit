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
        public async Task<IActionResult> CreateVideo([FromBody] CreateWorkoutVideoCommand command)
        {
            var videoId = await _mediator.Send(command);
            return Ok(new { id = videoId, message = "Video u krijua me sukses!\"" });

        }
    }

}