using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Application.Features.Exercise.Commands.CreateExerciseCategory;
using EliteFit.Application.Features.Exercise.Commands.DeleteExerciseCategory;
using EliteFit.Application.Features.Exercise.Commands.UpdateExerciseCategory;
using EliteFit.Application.Features.Exercise.Queries.GetExerciseCategoryById;
using EliteFit.Application.Features.Exercise.Queries.GetWorkoutConfigurations;
using EliteFit.Application.Features.Exercise.Queries.GetExerciseCategories;
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

        // 1. Merr të gjitha kategoritë (Përdoret edhe nga Admini edhe nga Klienti)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetExerciseCategoriesQuery());
            return Ok(result);
        }

        // 2. SHTOHEI E RE: Merr një kategori të vetme sipas Id-së (Përdoret kur Admini klikon "Edit")
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetExerciseCategoryByIdQuery(id));
            if (result == null) return NotFound(new { message = "Kategoria nuk u gjet!" });
            return Ok(result);
        }

        // 3. Shton kategori të re (Vetëm për Adminin)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateExerciseCategoryCommand command)
        {
            var id = await _mediator.Send(command);
            return Ok(new { id, message = "Kategoria u krijua me sukses!" });
        }

        // 4. SHTOHEI E RE: Përditëson kategorinë ekzistuese (Përdoret te formulari i Editimit)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateExerciseCategoryCommand command)
        {
            // Sigurohemi që ID në URL është e njëjtë me ID brenda trupit të kërkesës (body)
            if (id != command.Id) return BadRequest(new { message = "Id nuk përputhet!" });

            var updated = await _mediator.Send(command);
            if (!updated) return NotFound(new { message = "Kategoria nuk ekziston!" });

            return Ok(new { message = "Kategoria u përditësua me sukses!" });
        }

        // 5. SHTOHEI E RE: Fshin një kategori sipas Id-së
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _mediator.Send(new DeleteExerciseCategoryCommand(id));
            if (!deleted) return NotFound(new { message = "Kategoria nuk ekziston!" });

            return Ok(new { message = "Kategoria u fshi me sukses!" });
        }

        // 6. Merr konfigurimet e Enums (Vështirësitë dhe Grupet e Muskujve për dropdown-at në React)
        [HttpGet("configurations")]
        public async Task<IActionResult> GetConfigurations()
        {
            var result = await _mediator.Send(new GetWorkoutConfigurationsQuery());
            return Ok(result);
        }
    }
}