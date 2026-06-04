using EliteFit.Api.Authorization;
using EliteFit.Application.Features.Gamification.Command.Settings;
using EliteFit.Application.Features.Gamification.Queries.Settings;
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
    [Route("api/admin/settings")]
    [Authorize(Roles = "Admin")]
    public class AdminSettingsController(IMediator mediator, IAuditLogService auditLog) : ControllerBase
    {
        [HttpGet]
        [HasPermission(Permissions.Settings.View)]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await mediator.Send(new GetSettingsQuery(), ct));

        [HttpGet("{id:int}")]
        [HasPermission(Permissions.Settings.View)]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var result = await mediator.Send(new GetSettingByIdQuery(id), ct);
            return result is null ? NotFound($"Cilësimi me ID {id} nuk u gjet.") : Ok(result);
        }

        [HttpGet("by-key/{key}")]
        [HasPermission(Permissions.Settings.View)]
        public async Task<IActionResult> GetByKey(string key, CancellationToken ct)
        {
            var result = await mediator.Send(new GetSettingByKeyQuery(key), ct);
            return result is null ? NotFound($"Cilësimi me çelës '{key}' nuk u gjet.") : Ok(result);
        }

        [HttpPost]
        [HasPermission(Permissions.Settings.Create)]
        public async Task<IActionResult> Create([FromBody] CreateSettingCommand command, CancellationToken ct)
        {
            var newId = await mediator.Send(command, ct);
            await auditLog.LogAsync("Created", "Setting", newId,
                null,
                JsonSerializer.Serialize(new { command.Key, command.Value, command.Description }),
                CallerId, CallerName, CallerIp);
            return CreatedAtAction(nameof(GetById), new { id = newId }, new { Id = newId });
        }

        [HttpPut("{id:int}")]
        [HasPermission(Permissions.Settings.Update)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSettingCommand command, CancellationToken ct)
        {
            if (id != command.Id) return BadRequest("ID-të nuk përputhen.");
            var updated = await mediator.Send(command, ct);
            if (!updated) return NotFound($"Cilësimi me ID {id} nuk u gjet.");
            await auditLog.LogAsync("Updated", "Setting", id,
                null,
                JsonSerializer.Serialize(new { command.Key, command.Value, command.Description }),
                CallerId, CallerName, CallerIp);
            return Ok(new { Message = "Cilësimi i sistemit u përditësua me sukses." });
        }

        [HttpDelete("{id:int}")]
        [HasPermission(Permissions.Settings.Delete)]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            var deleted = await mediator.Send(new DeleteSettingCommand(id), ct);
            if (!deleted) return NotFound($"Cilësimi me ID {id} nuk ekziston.");
            await auditLog.LogAsync("Deleted", "Setting", id,
                null, null, CallerId, CallerName, CallerIp);
            return Ok(new { Message = "Cilësimi u fshi me sukses nga sistemi." });
        }

        private int? CallerId =>
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;
        private string? CallerName => User.FindFirstValue(ClaimTypes.Name);
        private string? CallerIp   => HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}
