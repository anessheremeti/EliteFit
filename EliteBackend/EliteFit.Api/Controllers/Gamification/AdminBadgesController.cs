using EliteFit.Application.Features.Gamification.Command.Badge;
using EliteFit.Application.Features.Gamification.Queries.Badge;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Gamification
{
    [ApiController]
    [Route("api/admin/badges")]
    public class AdminBadgesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminBadgesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetBadgesQuery());
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetBadgeByIdQuery(id));
            if (result == null) return NotFound($"Medalja me ID {id} nuk u gjet.");
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBadgeCommand command)
        {
            try
            {
                var badgeId = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetById), new { id = badgeId }, command);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBadgeCommand command)
        {
            if (id != command.Id) return BadRequest("ID e rrugës (URL) nuk përputhet me ID e trupit (Body).");

            try
            {
                var updated = await _mediator.Send(command);
                if (!updated) return NotFound($"Medalja me ID {id} nuk ekziston.");
                return Ok(new { Message = "Medalja u përditësua me sukses." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _mediator.Send(new DeleteBadgeCommand(id));
            if (!deleted) return NotFound($"Medalja me ID {id} nuk ekziston ose nuk mund të fshihet.");
            return Ok(new { Message = "Medalja u fshi me sukses." });
        }
    }
}
