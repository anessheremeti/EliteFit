using EliteFit.Application.DTOs.Personalization;
using EliteFit.Application.Features.Personalization.Command;
using EliteFit.Application.Features.Personalization.Query;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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