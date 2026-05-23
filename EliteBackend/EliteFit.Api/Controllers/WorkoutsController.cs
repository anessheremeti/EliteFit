using EliteFit.Application.Features.Queries.Workout;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WorkoutsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public WorkoutsController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? category,
            [FromQuery] string? difficulty,
            [FromQuery] string? muscleGroup)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = await _mediator.Send(new GetWorkoutsQuery(category, difficulty, muscleGroup, baseUrl));
            return Ok(result);
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeatured([FromQuery] int count = 3)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = await _mediator.Send(new GetFeaturedWorkoutsQuery(count, baseUrl));
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = await _mediator.Send(new GetWorkoutByIdQuery(id, baseUrl));
            return result is null ? NotFound() : Ok(result);
        }

        [HttpGet("{id:int}/related")]
        public async Task<IActionResult> GetRelated(int id, [FromQuery] string? category, [FromQuery] int limit = 4)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = await _mediator.Send(new GetRelatedWorkoutsQuery(id, category, limit, baseUrl));
            return Ok(result);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var result = await _mediator.Send(new GetWorkoutCategoriesQuery());
            return Ok(result);
        }

        [HttpGet("continue-watching")]
        public async Task<IActionResult> GetContinueWatching()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId)) return Unauthorized();

            var result = await _mediator.Send(new GetContinueWatchingQuery(userId));
            return Ok(result);
        }
    }
}
