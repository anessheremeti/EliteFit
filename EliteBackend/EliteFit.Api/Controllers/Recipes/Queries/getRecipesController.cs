using EliteFit.Application.DTOs.Recipes.query;
using EliteFit.Application.Features.Recipes.Queries.GetUserRecipesDetails;
using EliteFit.Application.Features.Recipes.Queries.GetUserRecipesList;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Recipes.Queries
{
    [ApiController]
    // URL: api/client/recipes
    [Route("api/client/get-recipes")]
    public class GetRecipesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetRecipesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/client/recipes?userId=1&maxCalories=600
        [HttpGet]
        public async Task<ActionResult<List<RecipeListDto>>> GetRecipes([FromQuery] GetRecipesListQuery query)
        {
            var recipes = await _mediator.Send(query);
            return Ok(recipes);
        }

        // GET: api/client/recipes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RecipeDetailsDto>> GetRecipeDetails(int id)
        {
            var recipe = await _mediator.Send(new GetRecipeDetailsQuery { Id = id });

            if (recipe == null)
            {
                return NotFound(new { Message = $"Receta me ID {id} nuk u gjet." });
            }

            return Ok(recipe);
        }
    }
}