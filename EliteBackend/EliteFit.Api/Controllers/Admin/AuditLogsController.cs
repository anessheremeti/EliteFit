using EliteFit.Api.Authorization;
using EliteFit.Application.Features.Admin.AuditLog.Queries;
using EliteFit.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/audit-logs")]
    [Authorize(Roles = "Admin")]
    public class AuditLogsController(IMediator mediator) : ControllerBase
    {
        /// <summary>
        /// GET /api/admin/audit-logs
        /// Optional query params: userId, entity, action, from, to, page, pageSize
        /// </summary>
        [HttpGet]
        [HasPermission(Permissions.AuditLogs.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] int?     userId   = null,
            [FromQuery] string?  entity   = null,
            [FromQuery] string?  action   = null,
            [FromQuery] DateTime? from    = null,
            [FromQuery] DateTime? to      = null,
            [FromQuery] int      page     = 1,
            [FromQuery] int      pageSize = 20,
            CancellationToken ct = default)
        {
            if (page < 1)     page     = 1;
            if (pageSize < 1) pageSize = 20;
            if (pageSize > 100) pageSize = 100;

            var result = await mediator.Send(
                new GetAuditLogsQuery(userId, entity, action, from, to, page, pageSize), ct);

            return Ok(result);
        }
    }
}
