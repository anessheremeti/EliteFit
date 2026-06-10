
using EliteFit.Application.Features.Gamification.Command.Notifications;
using EliteFit.Application.Features.Gamification.Queries.Notifications;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Gamification
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public NotificationsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Merr të gjitha njoftimet e një përdoruesi
        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetUserNotifications(int userId)
        {
            var result = await _mediator.Send(new GetUserNotificationsQuery(userId));
            return Ok(result);
        }

        // Merr numrin e njoftimeve të palexuara (Për t'ia treguar te ikona 🔔)
        [HttpGet("unread-count/{userId:int}")]
        public async Task<IActionResult> GetUnreadCount(int userId)
        {
            var result = await _mediator.Send(new GetUnreadCountQuery(userId));
            return Ok(new { UnreadCount = result });
        }

        // Bëj një njoftim si të lexuar kur përdoruesi klikon mbi të
        [HttpPut("mark-as-read")]
        public async Task<IActionResult> MarkAsRead([FromBody] MarkNotificationReadCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        // Bëji të gjitha njoftimet e lexuara (Butoni "Mark all as read")
        [HttpPut("mark-all-read")]
        public async Task<IActionResult> MarkAllAsRead([FromBody] MarkAllNotificationsReadCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

    }
}