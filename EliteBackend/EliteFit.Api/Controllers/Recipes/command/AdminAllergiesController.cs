using EliteFit.Application.DTOs.Recipes.command;
using EliteFit.Application.Features.Recipes.Commands.CreateAllergy;
using EliteFit.Application.Features.Recipes.Commands.DeleteAllergy;
using EliteFit.Application.Features.Recipes.Commands.DeleteRecipe;
using EliteFit.Application.Features.Recipes.Commands.UpdateAllergy;
using EliteFit.Application.Features.Recipes.Queries.GetAdminAllergies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Recipes.Command
{
    [ApiController]
    [Route("api/admin/allergies")]
    [Authorize(Roles = "Admin,Nutritionist")]
    public class AdminAllergiesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminAllergiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // 1. GET ALL (me Search dhe Pagination): api/admin/allergies?searchTerm=nuts&pageNumber=1&pageSize=10
        private async Task<ActionResult<List<AdminAllergyDto>>> GetAll([FromQuery] GetAdminAllergiesQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // 2. CREATE: api/admin/allergies
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAllergyCommand command)
        {
            var allergyId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetAll), new { id = allergyId }, new { Id = allergyId, Message = "Alergjia u krijua me sukses!" });
        }

        // 3. UPDATE: api/admin/allergies/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAllergyCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest(new { Message = "ID-ja në URL nuk përputhet me ID-në e trupit të kërkesës." });
            }

            await _mediator.Send(command);
            return Ok(new { Message = "Alergjia u përditësua me sukses!" });
        }

        // 4. DELETE: api/admin/allergies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _mediator.Send(new DeleteRecipeCommand { Id = id }); // Korrigjuar: Këtu dërgohet direkt komanda me ID-në përkatëse
            await _mediator.Send(new DeleteAllergyCommand { Id = id });
            return Ok(new { Message = "Alergjia u fshi me sukses!" });
        }
    }
}
