using EliteFit.Application.DTOs.Auth;
using EliteFit.Application.Features.Auth.Commands;
using EliteFit.Application.Features.Auth.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator     _mediator;
        private readonly IConfiguration _configuration;

        public AuthController(IMediator mediator, IConfiguration configuration)
        {
            _mediator      = mediator;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _mediator.Send(new RegisterCommand(request));
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _mediator.Send(new LoginQuery(request));
            return Ok(result);
        }

        /// <summary>
        /// Issues a new access + refresh token pair.
        /// The old refresh token is immediately revoked (token rotation).
        /// If a revoked token is replayed, ALL sessions for that user are wiped.
        /// </summary>
        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            var result = await _mediator.Send(new RefreshTokenCommand(request.RefreshToken));
            return Ok(result);
        }

        /// <summary>
        /// Revokes the supplied refresh token so it can never be used again.
        /// </summary>
        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task<IActionResult> Logout([FromBody] RefreshRequest request)
        {
            await _mediator.Send(new LogoutCommand(request.RefreshToken));
            return NoContent();
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var frontendBaseUrl = _configuration["AppSettings:FrontendBaseUrl"] ?? "http://localhost:5173";
            var devLink = await _mediator.Send(new ForgotPasswordCommand(request, frontendBaseUrl));

            return Ok(new
            {
                message      = "If that email is registered, you will receive a reset link shortly.",
                devResetLink = devLink
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            await _mediator.Send(new ResetPasswordCommand(request));
            return Ok(new { message = "Your password has been reset successfully. You can now log in." });
        }
    }

    public record RefreshRequest(string RefreshToken);
}
