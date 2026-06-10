using EliteFit.Application.Features.Recipes.Commands.UpdateUserAllergies; // Sigurohu që namespace është i saktë bazuar në folderin e handler-it
using EliteFit.Application.Features.Users.Commands.UpdateUserAllergies;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace EliteFit.Api.Controllers.Personalization
{
    [ApiController]
    [Route("api/user/allergies")]
    // [Authorize] // Zhbllokoje kur të kesh gati autentikimin me JWT Token
    public class UserAllergiesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserAllergiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // PUT: api/user/allergies/update
        [HttpPut("update")]
        public async Task<IActionResult> UpdateAllergies([FromBody] UpdateUserAllergiesCommand command)
        {
            if (command == null)
            {
                return BadRequest("Të dhënat e dërguara nuk janë valide.");
            }

            // Nëse më vonë dëshiron që UserId mos ta dërgosh nga frontendi për siguri:
            // command.UserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);

            try
            {
                await _mediator.Send(command);
                return Ok(new { message = "Alergjitë e përdoruesit u përditësuan me sukses!" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "Ndodhi një gabim i brendshëm në server gjatë ruajtjes.");
            }
        }
    }
}