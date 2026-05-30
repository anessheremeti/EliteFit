using EliteFit.Application.DTOs.Personalization;
using EliteFit.Application.Features.Personalization.Query;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Personalization
{
    [ApiController]
    [Route("api/client/personalization")]
    public class PersonalizationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PersonalizationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("smart-recipes")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<SmartRecipeDto>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetSmartRecipes([FromQuery] GetSmartRecipesQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("calorie-tracking")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CalorieTrackingDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCalorieTracking([FromQuery] GetCalorieTrackingQuery query)
        {
            if (query.TargetDate == default)
            {
                query.TargetDate = DateTime.UtcNow;
            }

            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
