using EliteFit.Api.Authorization;
using EliteFit.Application.Features.Roles.Commands.AssignPermissionToRole;
using EliteFit.Application.Features.Roles.Commands.CreateRole;
using EliteFit.Application.Features.Roles.Commands.DeleteRole;
using EliteFit.Application.Features.Roles.Commands.RemovePermissionFromRole;
using EliteFit.Application.Features.Roles.Commands.UpdateRole;
using EliteFit.Application.Features.Roles.Queries.GetRoleDetails;
using EliteFit.Application.Features.Roles.Queries.GetRoles;
using EliteFit.Domain.Authorization;
using EliteFit.Domain.Interfaces.Services;
using EliteFit.Infrastructure.Authorization;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace EliteFit.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/roles")]
    [Authorize(Roles = "Admin")]
    public class AdminRolesController(IMediator mediator, IAuditLogService auditLog) : ControllerBase
    {
        [HttpGet]
        [HasPermission(Permissions.Roles.View)]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await mediator.Send(new GetRolesQuery(), ct));

        [HttpGet("{id:int}")]
        [HasPermission(Permissions.Roles.View)]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var result = await mediator.Send(new GetRoleDetailsQuery(id), ct);
            return result is null ? NotFound() : Ok(result);
        }

        [HttpPost]
        [HasPermission(Permissions.Roles.Create)]
        public async Task<IActionResult> Create([FromBody] CreateRoleRequest req, CancellationToken ct)
        {
            var id = await mediator.Send(new CreateRoleCommand(req.Name, req.Description), ct);
            await auditLog.LogAsync("Created", "Role", id,
                null, JsonSerializer.Serialize(new { req.Name }),
                CallerId, CallerName, CallerIp);
            return CreatedAtAction(nameof(GetById), new { id }, new { Id = id });
        }

        [HttpPut("{id:int}")]
        [HasPermission(Permissions.Roles.Update)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRoleRequest req, CancellationToken ct)
        {
            var updated = await mediator.Send(new UpdateRoleCommand(id, req.Name, req.Description), ct);
            if (!updated) return NotFound();
            PermissionAuthorizationHandler.InvalidateCache();
            await auditLog.LogAsync("Updated", "Role", id,
                null, JsonSerializer.Serialize(new { req.Name }),
                CallerId, CallerName, CallerIp);
            return Ok();
        }

        [HttpDelete("{id:int}")]
        [HasPermission(Permissions.Roles.Delete)]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            var deleted = await mediator.Send(new DeleteRoleCommand(id), ct);
            if (!deleted) return NotFound();
            PermissionAuthorizationHandler.InvalidateCache();
            await auditLog.LogAsync("Deleted", "Role", id, null, null, CallerId, CallerName, CallerIp);
            return NoContent();
        }

        [HttpPost("{id:int}/permissions/{permissionId:int}")]
        [HasPermission(Permissions.Roles.Update)]
        public async Task<IActionResult> AssignPermission(int id, int permissionId, CancellationToken ct)
        {
            var result = await mediator.Send(new AssignPermissionToRoleCommand(id, permissionId), ct);
            if (!result) return NotFound();
            PermissionAuthorizationHandler.InvalidateCache();
            await auditLog.LogAsync("AssignedPermission", "Role", id,
                null, JsonSerializer.Serialize(new { permissionId }),
                CallerId, CallerName, CallerIp);
            return Ok();
        }

        [HttpDelete("{id:int}/permissions/{permissionId:int}")]
        [HasPermission(Permissions.Roles.Update)]
        public async Task<IActionResult> RemovePermission(int id, int permissionId, CancellationToken ct)
        {
            var result = await mediator.Send(new RemovePermissionFromRoleCommand(id, permissionId), ct);
            if (!result) return NotFound();
            PermissionAuthorizationHandler.InvalidateCache();
            await auditLog.LogAsync("RemovedPermission", "Role", id,
                JsonSerializer.Serialize(new { permissionId }), null,
                CallerId, CallerName, CallerIp);
            return NoContent();
        }

        private int? CallerId =>
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;
        private string? CallerName => User.FindFirstValue(ClaimTypes.Name);
        private string? CallerIp   => HttpContext.Connection.RemoteIpAddress?.ToString();
    }

    public record CreateRoleRequest(string Name, string? Description);
    public record UpdateRoleRequest(string Name, string? Description);
}
