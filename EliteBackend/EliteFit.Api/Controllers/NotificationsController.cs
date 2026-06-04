using EliteFit.Application.Features.Gamification.Command.Notifications;
using EliteFit.Application.Features.Gamification.Queries.Notifications;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize]
    public class NotificationsController(IMediator mediator) : ControllerBase
    {
        private int CurrentUserId =>
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await mediator.Send(new GetUserNotificationsQuery(CurrentUserId), ct));

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount(CancellationToken ct)
            => Ok(await mediator.Send(new GetUnreadCountQuery(CurrentUserId), ct));

        [HttpPatch("{id:int}/read")]
        public async Task<IActionResult> MarkRead(int id, CancellationToken ct)
        {
            var success = await mediator.Send(new MarkNotificationReadCommand(id, CurrentUserId), ct);
            return success ? NoContent() : NotFound();
        }

        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllRead(CancellationToken ct)
        {
            var count = await mediator.Send(new MarkAllNotificationsReadCommand(CurrentUserId), ct);
            return Ok(new { marked = count });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            var success = await mediator.Send(new DeleteNotificationCommand(id, CurrentUserId), ct);
            return success ? NoContent() : NotFound();
        }
    }
}
