using EliteFit.Application.Features.Queries.Badges;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/badges")]
    [Authorize]
    public class BadgesController : ControllerBase
    {
        private readonly IMediator _mediator;
        public BadgesController(IMediator mediator) => _mediator = mediator;

        private int UserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        /// <summary>
        /// Returns the full badge gallery for the current user — earned, in-progress,
        /// and locked badges — with live progress computed from workout, calorie, and
        /// streak data. Also auto-awards any badges the user has just unlocked.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetGallery([FromQuery] string? category)
        {
            var result = await _mediator.Send(new GetUserBadgesQuery(UserId, category));
            return Ok(result);
        }
    }
}
