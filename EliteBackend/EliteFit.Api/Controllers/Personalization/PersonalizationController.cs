using EliteFit.Application.DTOs.Personalization;
using EliteFit.Application.Features.Personalization.Command;
using EliteFit.Application.Features.Personalization.Queries.Onboarding;
using EliteFit.Application.Features.Personalization.Queries.Calories;
using EliteFit.Application.Features.Personalization.Queries.Recipes;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;

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
        public async Task<IActionResult> GetCalorieTracking([FromQuery] DateTime targetDate)
        {
            // Merre UserId nga token-i
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var query = new GetCalorieTrackingQuery
            {
                UserId = userId,
                TargetDate = targetDate == default ? DateTime.UtcNow : targetDate
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // KETU SHTOHET LOGJIKA E RE PER ONBOARDING STATUS
        [HttpGet("check-onboarding")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OnboardingStatusDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckOnboardingStatus([FromQuery] CheckOnboardingStatusQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("calculate-daily-target")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(int))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CalculateDailyTarget([FromBody] CalculateDailyTargetCommand command)
        {
            var targetCalories = await _mediator.Send(command);
            return Ok(new { DailyCalorieTarget = targetCalories });
        }
    }
}