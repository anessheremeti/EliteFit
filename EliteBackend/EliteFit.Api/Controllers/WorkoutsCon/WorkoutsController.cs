using EliteFit.Api.DTOs;
using EliteFit.Application.Features.Exercise.Queries.GetExerciseCategories;
using EliteFit.Application.Features.Workouts.Commands.CompleteWorkoutVideo;
using EliteFit.Application.Features.Workouts.Commands.CreateWorkoutVideo;
using EliteFit.Application.Features.Workouts.Commands.DeleteWorkoutVideo;
using EliteFit.Application.Features.Workouts.Commands.UpdateWorkoutVideo;
using EliteFit.Application.Features.Workouts.Queries.GetWorkoutVideos;
// Supozojmë se këtu ke namespace-in për Query e kategorive, nëse jo, mund ta krijosh ose t'i thërrasësh direkt me Repo.
// Për shembull: using EliteFit.Application.Features.Workouts.Queries.GetExerciseCategories; 
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public WorkoutsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // 1. MERR TË GJITHA VIDEOT
        [HttpGet("videos")]
        public async Task<IActionResult> GetVideos([FromQuery] GetWorkoutVideosQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // KJO ËSHTË METODA E RE PËR TË THIRRUR KATEGORITË
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            // Mund të krijosh një Query të thjeshtë në Application layer: GetExerciseCategoriesQuery
            // Për thjeshtësi po e paraqesim thirrjen përmes Mediator
            var categories = await _mediator.Send(new GetExerciseCategoriesQuery());
            return Ok(categories);
        }

        // 2. KRIJO VIDEO (SHTO)
        [HttpPost("create-video")]
        public async Task<IActionResult> CreateVideo([FromBody] CreateWorkoutVideoRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var command = new CreateWorkoutVideoCommand
            {
                Title = request.Title,
                Description = request.Description,
                CategoryId = request.CategoryId,
                DurationSeconds = request.DurationSeconds,
                DifficultyLevel = request.DifficultyLevel,
                MuscleGroup = request.MuscleGroup,
                EstimatedCaloriesBurned = request.EstimatedCaloriesBurned,
                UploaderId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "1"),
                VideoUrl = request.VideoUrl
            };

            var result = await _mediator.Send(command);
            return Ok(new { id = result, message = "Stërvitja u krijua me sukses me linkun e videos." });
        }

        // 3. PËRDITËSO VIDEO (UPDATE) - Ndryshuar në [FromBody] për të pranuar JSON nga React
        [HttpPut("update-video")]
        public async Task<IActionResult> UpdateVideo([FromBody] UpdateWorkoutVideoRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var command = new UpdateWorkoutVideoCommand
            {
                Id = request.Id,
                Title = request.Title,
                Description = request.Description,
                CategoryId = request.CategoryId,
                DurationSeconds = request.DurationSeconds,
                DifficultyLevel = request.DifficultyLevel,
                MuscleGroup = request.MuscleGroup,
                EstimatedCaloriesBurned = request.EstimatedCaloriesBurned,
                VideoUrl = request.VideoUrl // Kalojmë edhe URL-në e re nëse ndryshon
            };

            var isUpdated = await _mediator.Send(command);
            if (!isUpdated) return NotFound(new { Message = $"Video me ID {request.Id} nuk u gjet." });

            return Ok(new { Message = "Video u përditësua me sukses!" });
        }

        // 4. FSHI VIDEO
        [HttpDelete("videos/{id}")]
        public async Task<IActionResult> DeleteVideo(int id)
        {
            var command = new DeleteWorkoutVideoCommand(id);
            var result = await _mediator.Send(command);
            if (!result) return NotFound(new { message = "Videoja nuk u gjet ose nuk u fshi dot!" });
            return Ok(new { message = "Videoja u fshi me sukses!" });
        }

        // 5. PËRFUNDO VIDEO
        [HttpPost("complete-video")]
        public async Task<IActionResult> CompleteVideo([FromBody] CompleteWorkoutVideoCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result) return NotFound(new { message = "Videoja stërvitore nuk u gjet!" });
            return Ok(new { message = "Historiku u regjistrua me sukses!" });
        }
    }

    // Klasa DTO për Create
    public class CreateWorkoutVideoRequestDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }
        public int DurationSeconds { get; set; }
        public string DifficultyLevel { get; set; }
        public string MuscleGroup { get; set; }
        public int EstimatedCaloriesBurned { get; set; }
        public string VideoUrl { get; set; }
    }

    // Klasa e re DTO për Update (pasi hoqëm form-data për shkak të YouTube link)
    public class UpdateWorkoutVideoRequestDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }
        public int? DurationSeconds { get; set; }
        public string DifficultyLevel { get; set; }
        public string MuscleGroup { get; set; }
        public int? EstimatedCaloriesBurned { get; set; }
        public string VideoUrl { get; set; }
    }
}