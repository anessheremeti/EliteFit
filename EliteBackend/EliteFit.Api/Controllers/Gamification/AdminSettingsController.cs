using EliteFit.Application.Features.Gamification.Command.Settings;
using EliteFit.Application.Features.Gamification.Queries.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Gamification
{
    [ApiController]
    [Route("api/admin/settings")]
    [Authorize(Roles = "Admin")]
    public class AdminSettingsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminSettingsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetSettingsQuery());
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetSettingByIdQuery(id));
            if (result == null) return NotFound($"Cilësimi me ID {id} nuk u gjet.");
            return Ok(result);
        }

        [HttpGet("by-key/{key}")]
        public async Task<IActionResult> GetByKey(string key)
        {
            var result = await _mediator.Send(new GetSettingByKeyQuery(key));
            if (result == null) return NotFound($"Cilësimi me çelës '{key}' nuk u gjet.");
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSettingCommand command)
        {
            var settingId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = settingId }, command);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSettingCommand command)
        {
            if (id != command.Id) return BadRequest("ID-të nuk përputhen.");

            var updated = await _mediator.Send(command);
            if (!updated) return NotFound($"Cilësimi me ID {id} nuk u gjet.");
            return Ok(new { Message = "Cilësimi i sistemit u përditësua me sukses." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _mediator.Send(new DeleteSettingCommand(id));
            if (!deleted) return NotFound($"Cilësimi me ID {id} nuk ekziston.");
            return Ok(new { Message = "Cilësimi u fshi me sukses nga sistemi." });
        }
    }
}
