using EliteFit.Application.Features.Gamification.Command.QuickFixTip;
using EliteFit.Application.Features.Gamification.Queries.QuickFixTip;
using EliteFit.Domain.Interfaces.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace EliteFit.Api.Controllers.Gamification
{
    [ApiController]
    [Route("api/admin/quickfix-tips")]
    [Authorize(Roles = "Admin")]
    public class AdminQuickFixTipsController(IMediator mediator, IAuditLogService auditLog) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await mediator.Send(new GetQuickFixTipsQuery()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await mediator.Send(new GetQuickFixTipByIdQuery(id));
            if (result == null) return NotFound($"Këshilla me ID {id} nuk u gjet.");
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateQuickFixTipCommand command)
        {
            var tipId = await mediator.Send(command);

            await auditLog.LogAsync(
                action:    "Created",
                entity:    "QuickFixTip",
                entityId:  tipId,
                oldValue:  null,
                newValue:  JsonSerializer.Serialize(new { command.Title, command.Category }),
                userId:    CallerId,
                userName:  CallerName,
                ipAddress: CallerIp);

            return CreatedAtAction(nameof(GetById), new { id = tipId }, command);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateQuickFixTipCommand command)
        {
            if (id != command.Id) return BadRequest("ID e URL nuk përputhet me ID e Command.");

            var updated = await mediator.Send(command);
            if (!updated) return NotFound($"Këshilla me ID {id} nuk ekziston.");

            await auditLog.LogAsync(
                action:    "Updated",
                entity:    "QuickFixTip",
                entityId:  id,
                oldValue:  null,
                newValue:  JsonSerializer.Serialize(new { command.Title, command.Category }),
                userId:    CallerId,
                userName:  CallerName,
                ipAddress: CallerIp);

            return Ok(new { Message = "Këshilla u përditësua me sukses." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await mediator.Send(new DeleteQuickFixTipCommand(id));
            if (!deleted) return NotFound($"Këshilla me ID {id} nuk ekziston.");

            await auditLog.LogAsync(
                action:    "Deleted",
                entity:    "QuickFixTip",
                entityId:  id,
                oldValue:  JsonSerializer.Serialize(new { Id = id }),
                newValue:  null,
                userId:    CallerId,
                userName:  CallerName,
                ipAddress: CallerIp);

            return Ok(new { Message = "Këshilla u fshi me sukses." });
        }

        // ── helpers ────────────────────────────────────────────────────────────
        private int? CallerId =>
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;
        private string? CallerName => User.FindFirstValue(ClaimTypes.Name);
        private string? CallerIp   => HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}
