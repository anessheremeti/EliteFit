using EliteFit.Api.Authorization;
using EliteFit.Application.DTOs.Recipes.command;
using EliteFit.Application.Features.Recipes.Commands.CreateRecipe;
using EliteFit.Application.Features.Recipes.Commands.DeleteRecipe;
using EliteFit.Application.Features.Recipes.Commands.UpdateRecipe;
using EliteFit.Application.Features.Recipes.Queries.GetAdminRecipes;
using EliteFit.Domain.Authorization;
using EliteFit.Domain.Interfaces.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace EliteFit.Api.Controllers.Recipes.Command
{
    [ApiController]
    [Route("api/admin/recipes")]
    [Authorize(Roles = "Admin,Nutritionist")]
    public class AdminRecipesController(IMediator mediator, IAuditLogService auditLog) : ControllerBase
    {
        [HttpGet]
        [HasPermission(Permissions.Recipes.View)]
        public async Task<ActionResult<List<AdminRecipeDto>>> GetAll()
            => Ok(await mediator.Send(new GetAdminRecipesQuery()));

        [HttpPost]
        [HasPermission(Permissions.Recipes.Create)]
        public async Task<IActionResult> Create([FromBody] CreateRecipeCommand command)
        {
            var id = await mediator.Send(command);

            await auditLog.LogAsync(
                action:    "Created",
                entity:    "Recipe",
                entityId:  id,
                oldValue:  null,
                newValue:  JsonSerializer.Serialize(new { command.Title, command.Calories }),
                userId:    CallerId,
                userName:  CallerName,
                ipAddress: CallerIp);

            return CreatedAtAction(nameof(GetAll), new { id }, new { Id = id });
        }

        [HttpPut("{id}")]
        [HasPermission(Permissions.Recipes.Update)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRecipeCommand command)
        {
            if (id != command.Id) return BadRequest(new { Message = "ID mismatch." });

            await mediator.Send(command);

            await auditLog.LogAsync(
                action:    "Updated",
                entity:    "Recipe",
                entityId:  id,
                oldValue:  null,
                newValue:  JsonSerializer.Serialize(new { command.Title, command.Calories }),
                userId:    CallerId,
                userName:  CallerName,
                ipAddress: CallerIp);

            return Ok(new { Message = "Recipe updated." });
        }

        [HttpDelete("{id}")]
        [HasPermission(Permissions.Recipes.Delete)]
        public async Task<IActionResult> Delete(int id)
        {
            await mediator.Send(new DeleteRecipeCommand { Id = id });

            await auditLog.LogAsync(
                action:    "Deleted",
                entity:    "Recipe",
                entityId:  id,
                oldValue:  JsonSerializer.Serialize(new { Id = id }),
                newValue:  null,
                userId:    CallerId,
                userName:  CallerName,
                ipAddress: CallerIp);

            return Ok(new { Message = "Recipe deleted." });
        }

        // ── helpers ────────────────────────────────────────────────────────────
        private int? CallerId =>
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;
        private string? CallerName => User.FindFirstValue(ClaimTypes.Name);
        private string? CallerIp   => HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}
