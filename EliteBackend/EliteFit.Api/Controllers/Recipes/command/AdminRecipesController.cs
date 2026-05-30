using EliteFit.Application.DTOs.Recipes.command;
using EliteFit.Application.Features.Recipes.Commands.CreateRecipe;
using EliteFit.Application.Features.Recipes.Commands.DeleteRecipe;
using EliteFit.Application.Features.Recipes.Commands.UpdateRecipe;
using EliteFit.Application.Features.Recipes.Query.GetAdminRecipes;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Recipes.command
{
    [ApiController]
    [Route("api/admin/recipes")]
    // [Authorize(Roles = "Admin")] // Zhbllokoje kur të kesh gati JWT rolet
    public class AdminRecipesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminRecipesController(IMediator mediator) => _mediator = mediator;

        // 1. GET ALL: api/admin/recipes
        [HttpGet]
        public async Task<ActionResult<List<AdminRecipeDto>>> GetAll()
        {
            var result = await _mediator.Send(new GetAdminRecipesQuery());
            return Ok(result);
        }

        // 2. CREATE: api/admin/recipes
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRecipeCommand command)
        {
            var recipeId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetAll), new { id = recipeId }, new { Id = recipeId, Message = "Receta u krijua me sukses nga Admini!" });
        }

        // 3. UPDATE: api/admin/recipes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRecipeCommand command)
        {
            if (id != command.Id) return BadRequest(new { Message = "Mospërputhje e ID-së." });

            await _mediator.Send(command);
            return Ok(new { Message = "Receta u përditësua me sukses nga Admini!" });
        }

        // 4. DELETE: api/admin/recipes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _mediator.Send(new DeleteRecipeCommand { Id = id });
            return Ok(new { Message = "Receta u fshi me sukses nga Admini!" });
        }
    }
}
