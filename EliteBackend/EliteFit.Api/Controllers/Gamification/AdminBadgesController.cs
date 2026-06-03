using EliteFit.Api.Authorization;
using EliteFit.Application.Features.Gamification.Command.Badge;
using EliteFit.Application.Features.Gamification.Queries.Badge;
using EliteFit.Domain.Authorization;
using EliteFit.Domain.Interfaces.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace EliteFit.Api.Controllers.Gamification
{
    [ApiController]
    [Route("api/admin/badges")]
    [Authorize(Roles = "Admin")]
    public class AdminBadgesController(IMediator mediator, IAuditLogService auditLog) : ControllerBase
    {
        [HttpGet]
        [HasPermission(Permissions.Badges.View)]
        public async Task<IActionResult> GetAll()
            => Ok(await mediator.Send(new GetBadgesQuery()));

        [HttpGet("{id}")]
        [HasPermission(Permissions.Badges.View)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await mediator.Send(new GetBadgeByIdQuery(id));
            if (result == null) return NotFound($"Medalja me ID {id} nuk u gjet.");
            return Ok(result);
        }

        [HttpPost]
        [HasPermission(Permissions.Badges.Create)]
        public async Task<IActionResult> Create([FromBody] CreateBadgeCommand command)
        {
            try
            {
                var badgeId = await mediator.Send(command);

                await auditLog.LogAsync(
                    action:    "Created",
                    entity:    "Badge",
                    entityId:  badgeId,
                    oldValue:  null,
                    newValue:  JsonSerializer.Serialize(new { command.Name, command.Description, command.BadgeIconId }),
                    userId:    CallerId,
                    userName:  CallerName,
                    ipAddress: CallerIp);

                return CreatedAtAction(nameof(GetById), new { id = badgeId }, command);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [HasPermission(Permissions.Badges.Update)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBadgeCommand command)
        {
            if (id != command.Id) return BadRequest("ID e rrugës (URL) nuk përputhet me ID e trupit (Body).");

            try
            {
                var updated = await mediator.Send(command);
                if (!updated) return NotFound($"Medalja me ID {id} nuk ekziston.");

                await auditLog.LogAsync(
                    action:    "Updated",
                    entity:    "Badge",
                    entityId:  id,
                    oldValue:  null,
                    newValue:  JsonSerializer.Serialize(new { command.Name, command.Description, command.BadgeIconId }),
                    userId:    CallerId,
                    userName:  CallerName,
                    ipAddress: CallerIp);

                return Ok(new { Message = "Medalja u përditësua me sukses." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [HasPermission(Permissions.Badges.Delete)]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await mediator.Send(new DeleteBadgeCommand(id));
            if (!deleted) return NotFound($"Medalja me ID {id} nuk ekziston ose nuk mund të fshihet.");

            await auditLog.LogAsync(
                action:    "Deleted",
                entity:    "Badge",
                entityId:  id,
                oldValue:  JsonSerializer.Serialize(new { Id = id }),
                newValue:  null,
                userId:    CallerId,
                userName:  CallerName,
                ipAddress: CallerIp);

            return Ok(new { Message = "Medalja u fshi me sukses." });
        }

        // ── helpers ────────────────────────────────────────────────────────────
        private int? CallerId =>
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;
        private string? CallerName => User.FindFirstValue(ClaimTypes.Name);
        private string? CallerIp   => HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}
