using EliteFit.Application.DTOs.ExerciseLog;
using EliteFit.Application.Features.Commands.ExerciseLog;
using EliteFit.Application.Features.Queries.ExerciseLog;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/exercise-logs")]
    [Authorize]
    public class ExerciseLogsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ExerciseLogsController(IMediator mediator) => _mediator = mediator;

        private int UserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        /// <summary>Record a completed exercise for the authenticated user.</summary>
        [HttpPost]
        public async Task<IActionResult> Log([FromBody] CreateExerciseLogRequest request)
        {
            var result = await _mediator.Send(new LogExerciseCommand(UserId, request));
            return CreatedAtAction(nameof(GetHistory), null, result);
        }

        /// <summary>Paginated exercise history for the authenticated user, newest first.</summary>
        [HttpGet]
        public async Task<IActionResult> GetHistory(
            [FromQuery] int page     = 1,
            [FromQuery] int pageSize = 20)
        {
            pageSize = Math.Clamp(pageSize, 1, 100);
            var result = await _mediator.Send(new GetUserExerciseHistoryQuery(UserId, page, pageSize));
            return Ok(result);
        }

        /// <summary>Aggregated analytics: total calories, time, and breakdown by body part.</summary>
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var result = await _mediator.Send(new GetExerciseSummaryQuery(UserId));
            return Ok(result);
        }

        /// <summary>Aggregated stats for a specific exercise (video) for the authenticated user.</summary>
        [HttpGet("session-stats")]
        public async Task<IActionResult> GetSessionStats([FromQuery] int exerciseId)
        {
            var result = await _mediator.Send(new GetExerciseSessionStatsQuery(UserId, exerciseId));
            return Ok(result);
        }
    }
}
