using EliteFit.Application.Features.Users.Commands.Profile.UpdateProfile;
using EliteFit.Application.Features.Account.Commands.DeleteAccount;
using EliteFit.Application.Features.Users.Commands.Profile.ChangePassword;
using EliteFit.Application.Features.Account.Queries.GetProfile;
using EliteFit.Application.Features.Users.Queries.GetProfile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EliteFit.API.Controllers
{
    [Route("api/user-profile")]
    [ApiController]
    [Authorize]
    public class UserProfileController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserProfileController(IMediator mediator)
        {
            _mediator = mediator;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var result = await _mediator.Send(new GetProfileQuery(GetUserId()));
            return result != null ? Ok(result) : NotFound();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileCommand command)
        {
            var result = await _mediator.Send(command with { UserId = GetUserId() });
            return result ? Ok(new { message = "Profili u përditësua." }) : BadRequest();
        }

        [HttpPatch("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
        {
            try
            {
                await _mediator.Send(command with { UserId = GetUserId() });
                return Ok(new { message = "Fjalëkalimi u ndryshua." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAccount()
        {
            var result = await _mediator.Send(new DeleteAccountCommand(GetUserId()));
            return result ? Ok(new { message = "Llogaria u fshi." }) : NotFound();
        }
    }
}