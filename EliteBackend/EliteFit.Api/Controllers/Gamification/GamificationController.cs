using EliteFit.Application.Features.Gamification.Command.Streak;
using EliteFit.Application.Features.Gamification.Command.UserBadge;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Gamification
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamificationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GamificationController(IMediator _mediator)
        {
            this._mediator = _mediator;
        }

        [HttpGet("badges/{userId}")]
        public async Task<IActionResult> GetUserBadges(int userId)
        {
            var result = await _mediator.Send(new GetUserBadgesQuery(userId));
            return Ok(result);
        }

        [HttpGet("streak/{userId}")]
        public async Task<IActionResult> GetUserStreak(int userId)
        {
            var result = await _mediator.Send(new GetUserStreakQuery(userId));
            if (result == null) return NotFound("Të dhënat e streak nuk u gjetën.");
            return Ok(result);
        }

        [HttpPost("streak/activity")]
        public async Task<IActionResult> UpdateStreak([FromBody] UpdateStreakCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
