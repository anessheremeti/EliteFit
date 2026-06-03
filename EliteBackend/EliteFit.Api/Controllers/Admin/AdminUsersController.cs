using EliteFit.Api.Authorization;
using EliteFit.Application.Features.Users.Commands.AssignRoleToUser;
using EliteFit.Application.Features.Users.Commands.RemoveRoleFromUser;
using EliteFit.Application.Features.Users.Commands.SetUserActiveStatus;
using EliteFit.Application.Features.Users.Queries.GetUsers;
using EliteFit.Domain.Authorization;
using EliteFit.Domain.Interfaces.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace EliteFit.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController(IMediator mediator, IAuditLogService auditLog) : ControllerBase
    {
        [HttpGet]
        [HasPermission(Permissions.Users.View)]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await mediator.Send(new GetUsersQuery(), ct));

        [HttpPatch("{id:int}/activate")]
        [HasPermission(Permissions.Users.Activate)]
        public async Task<IActionResult> Activate(int id, CancellationToken ct)
        {
            var updated = await mediator.Send(new SetUserActiveStatusCommand(id, true), ct);
            if (!updated) return NotFound($"Përdoruesi me ID {id} nuk u gjet.");

            await auditLog.LogAsync(
                action:    "Activated",
                entity:    "User",
                entityId:  id,
                oldValue:  JsonSerializer.Serialize(new { IsActive = false }),
                newValue:  JsonSerializer.Serialize(new { IsActive = true }),
                userId:    CallerId,
                userName:  CallerName,
                ipAddress: CallerIp);

            return Ok(new { Message = "Përdoruesi u aktivizua me sukses." });
        }

        [HttpPatch("{id:int}/deactivate")]
        [HasPermission(Permissions.Users.Deactivate)]
        public async Task<IActionResult> Deactivate(int id, CancellationToken ct)
        {
            var updated = await mediator.Send(new SetUserActiveStatusCommand(id, false), ct);
            if (!updated) return NotFound($"Përdoruesi me ID {id} nuk u gjet.");

            await auditLog.LogAsync(
                action:    "Deactivated",
                entity:    "User",
                entityId:  id,
                oldValue:  JsonSerializer.Serialize(new { IsActive = true }),
                newValue:  JsonSerializer.Serialize(new { IsActive = false }),
                userId:    CallerId,
                userName:  CallerName,
                ipAddress: CallerIp);

            return Ok(new { Message = "Përdoruesi u çaktivizua me sukses." });
        }

        [HttpPost("{id:int}/roles/{roleId:int}")]
        [HasPermission(Permissions.Users.Manage)]
        public async Task<IActionResult> AssignRole(int id, int roleId, CancellationToken ct)
        {
            var result = await mediator.Send(new AssignRoleToUserCommand(id, roleId), ct);
            if (!result) return NotFound($"Përdoruesi ose roli me ID {id}/{roleId} nuk u gjet.");
            await auditLog.LogAsync("AssignedRole", "User", id,
                null, JsonSerializer.Serialize(new { roleId }),
                CallerId, CallerName, CallerIp);
            return Ok(new { Message = "Roli u caktua me sukses." });
        }

        [HttpDelete("{id:int}/roles/{roleId:int}")]
        [HasPermission(Permissions.Users.Manage)]
        public async Task<IActionResult> RemoveRole(int id, int roleId, CancellationToken ct)
        {
            var result = await mediator.Send(new RemoveRoleFromUserCommand(id, roleId), ct);
            if (!result) return NotFound($"Caktimi i rolit nuk u gjet.");
            await auditLog.LogAsync("RemovedRole", "User", id,
                JsonSerializer.Serialize(new { roleId }), null,
                CallerId, CallerName, CallerIp);
            return NoContent();
        }

        private int? CallerId =>
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;
        private string? CallerName => User.FindFirstValue(ClaimTypes.Name);
        private string? CallerIp   => HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}
