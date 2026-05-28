
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Application.Features.Exercise.Commands;
using EliteFit.Application.Features.Exercise.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExerciseCategoriesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ExerciseCategoriesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Merr të gjitha kategoritë (Përdoret edhe nga Admini edhe nga Klienti)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetExerciseCategoriesQuery());
            return Ok(result);
        }

        // Shton kategori të re (Vetëm për Adminin)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateExerciseCategoryCommand command)
        {
            var id = await _mediator.Send(command);
            return Ok(new { id, message = "Kategoria u krijua me sukses!" });
        }
    }
}