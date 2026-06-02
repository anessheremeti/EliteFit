using EliteFit.Application.Features.Gamification.Command.QuickFixTip;
using EliteFit.Application.Features.Gamification.Queries.QuickFixTip;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Gamification
{
    [ApiController]
    [Route("api/admin/quickfix-tips")]
    public class AdminQuickFixTipsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminQuickFixTipsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetQuickFixTipsQuery());
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetQuickFixTipByIdQuery(id));
            if (result == null) return NotFound($"Këshilla me ID {id} nuk u gjet.");
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateQuickFixTipCommand command)
        {
            var tipId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = tipId }, command);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateQuickFixTipCommand command)
        {
            if (id != command.Id) return BadRequest("ID e URL nuk përputhet me ID e Command.");

            var updated = await _mediator.Send(command);
            if (!updated) return NotFound($"Këshilla me ID {id} nuk ekziston.");
            return Ok(new { Message = "Këshilla u përditësua me sukses." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _mediator.Send(new DeleteQuickFixTipCommand(id));
            if (!deleted) return NotFound($"Këshilla me ID {id} nuk ekziston.");
            return Ok(new { Message = "Këshilla u fshi me sukses." });
        }
    }
}
