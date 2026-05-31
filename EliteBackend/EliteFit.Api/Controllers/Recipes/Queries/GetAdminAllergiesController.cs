using EliteFit.Application.DTOs.Recipes.command;
using EliteFit.Application.Features.Recipes.Commands.CreateAllergy;
using EliteFit.Application.Features.Recipes.Commands.DeleteAllergy;
using EliteFit.Application.Features.Recipes.Commands.DeleteRecipe;
using EliteFit.Application.Features.Recipes.Commands.UpdateAllergy;
using EliteFit.Application.Features.Recipes.Queries.GetAdminAllergies;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Recipes.Queries
{
    [ApiController]
    [Route("api/admin/get-allergies")]
    // [Authorize(Roles = "Admin")] // Zhbllokoje kur të kesh gati rolet
    public class GetAdminAllergiesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetAdminAllergiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // 1. GET ALL (me Search dhe Pagination): api/admin/allergies?searchTerm=nuts&pageNumber=1&pageSize=10
        [HttpGet]
        public async Task<ActionResult<List<AdminAllergyDto>>> GetAll([FromQuery] GetAdminAllergiesQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

    }
}
