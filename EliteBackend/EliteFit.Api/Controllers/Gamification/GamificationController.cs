using EliteFit.Application.Features.Gamification.Command.Streak;
using EliteFit.Application.Features.Gamification.Queries.Badge;
using EliteFit.Application.Features.Gamification.Queries.QuickFixTip;
using EliteFit.Application.Features.Gamification.Command.UserBadge; // Përdorim këtë pasi klasat e tua ndodhen këtu
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Gamification
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GamificationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GamificationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // ── MEDALJET (BADGES) ──────────────────────────────────────────────────
        [HttpGet("badges/{userId:int}")]
        public async Task<IActionResult> GetUserBadges(int userId)
        {
            // Nëse GetUserBadgesQuery nuk njihet, sigurohu që është brenda Command.UserBadge ose ndrysho namespace-in e saj në skedar
            var result = await _mediator.Send(new GetUserBadgesQuery(userId));
            return Ok(result);
        }

        // ── STREAK (SERIA E DITËVE) ───────────────────────────────────────────
        [HttpGet("streak/{userId:int}")]
        public async Task<IActionResult> GetUserStreak(int userId)
        {
            // Meqenëse folderi Queries/Streak nuk ekziston, GetUserStreakQuery duhet të jetë brenda Command.Streak
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

        // ── KËSHILLAT (QUICKFIX TIPS) PËR PËRDORUESIN ─────────────────────────
        [HttpGet("quickfix-tips")]
        public async Task<IActionResult> GetTipsForUser()
        {
            var result = await _mediator.Send(new GetQuickFixTipsQuery());
            return Ok(result);
        }
    }
}