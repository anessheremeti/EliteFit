using EliteFit.Application.Features.Personalization.Command;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EliteFit.Api.Controllers.Onboarding
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OnboardingController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OnboardingController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // 1. POST: api/Onboarding/complete
        [HttpPost("complete")]
        public async Task<IActionResult> CompleteOnboarding([FromBody] CompleteOnboardingCommand command)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { Success = false, Message = "Useri nuk është i identifikuar." });
            }

            command.UserId = int.Parse(userIdClaim);

            var result = await _mediator.Send(command);

            if (result)
            {
                return Ok(new { Success = true, Message = "Onboarding u përfundua me sukses!" });
            }

            return BadRequest(new { Success = false, Message = "Ruajtja e onboarding dështoi." });
        }

        // 2. PUT: api/Onboarding/update
        [HttpPut("update")]
        public async Task<IActionResult> UpdateOnboarding([FromBody] UpdateOnboardingCommand command)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { Success = false, Message = "Useri nuk është i identifikuar." });
            }

            command.UserId = int.Parse(userIdClaim);

            var result = await _mediator.Send(command);

            if (result)
            {
                return Ok(new { Success = true, Message = "Profili u përditësua me sukses!" });
            }

            return BadRequest(new { Success = false, Message = "Përditësimi dështoi. Profili mund të mos ekzistojë." });
        }
    }
}