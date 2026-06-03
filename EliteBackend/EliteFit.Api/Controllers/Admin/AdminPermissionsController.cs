using EliteFit.Api.Authorization;
using EliteFit.Application.Features.Permissions.Queries.GetPermissions;
using EliteFit.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/permissions")]
    [Authorize(Roles = "Admin")]
    public class AdminPermissionsController(IMediator mediator) : ControllerBase
    {
        [HttpGet]
        [HasPermission(Permissions.Roles.View)]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await mediator.Send(new GetPermissionsQuery(), ct));
    }
}
