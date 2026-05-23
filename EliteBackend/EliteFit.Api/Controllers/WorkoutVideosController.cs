using EliteFit.Application.Features.Queries.Workout;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/workout-videos")]
    [Authorize]
    public class WorkoutVideosController : ControllerBase
    {
        private readonly IMediator _mediator;
        public WorkoutVideosController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? category)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = await _mediator.Send(new GetWorkoutVideosQuery(baseUrl, category));
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = await _mediator.Send(new GetWorkoutVideoByIdQuery(id, baseUrl));
            return result is null ? NotFound() : Ok(result);
        }
    }
}
