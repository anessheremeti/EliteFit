using EliteFit.Application.Features.Queries.Recipes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/recipes")]
    [Authorize]
    public class RecipesController : ControllerBase
    {
        private readonly IMediator _mediator;
        public RecipesController(IMediator mediator) => _mediator = mediator;

        private int UserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        /// <summary>
        /// Paginated recipe feed, automatically filtered by the user's allergies and diet type.
        /// Supports optional category, dietType, and search query parameters.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetFeed(
            [FromQuery] string? category,
            [FromQuery] string? dietType,
            [FromQuery] string? search,
            [FromQuery] int page     = 1,
            [FromQuery] int pageSize = 12)
        {
            var result = await _mediator.Send(
                new GetRecipeFeedQuery(UserId, category, dietType, search, page, pageSize));
            return Ok(result);
        }

        /// <summary>Single recipe by id.</summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetRecipeByIdQuery(id));
            return result is null ? NotFound(new { message = "Recipe not found." }) : Ok(result);
        }

        /// <summary>All distinct recipe categories for populating the filter bar.</summary>
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var result = await _mediator.Send(new GetRecipeCategoriesQuery());
            return Ok(result);
        }
    }
}
