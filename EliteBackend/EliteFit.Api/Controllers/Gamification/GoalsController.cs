using EliteFit.Application.Features.Gamification.Command.Goals;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Gamification
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoalsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GoalsController(IMediator _mediator)
        {
            this._mediator = _mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllGoals()
        {
            var result = await _mediator.Send(new GetAllGoalsQuery());
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserGoals(int userId)
        {
            var result = await _mediator.Send(new GetUserGoalsQuery(userId));
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateGoal([FromBody] CreateGoalCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGoal(int id, [FromBody] UpdateGoalCommand command)
        {
            if (id != command.Id) return BadRequest();
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            var result = await _mediator.Send(new DeleteGoalCommand(id));
            return Ok(result);
        }

        [HttpPost("user/assign")]
        public async Task<IActionResult> AssignGoals([FromBody] AssignGoalsToUserCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
