
﻿using EliteFit.Api.DTOs;
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
﻿using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using EliteFit.Application.Features.Workouts.Queries.GetWorkoutVideos;
using EliteFit.Application.Features.Workouts.Commands.CompleteWorkoutVideo;
using EliteFit.Application.Features.Workouts.Commands.CreateWorkoutVideo;
using EliteFit.Application.Features.Workouts.Queries.GetContinueWatching; // Shto këtë import
using Microsoft.AspNetCore.Authorization;
using EliteFit.Application.Features.Workouts.Queries.GetFeaturedVideos;
using Microsoft.EntityFrameworkCore;
using EliteFit.Persistence.Persistence.Context;
using EliteFit.Application.Features.Exercise.Queries.GetExerciseCategories;

namespace EliteFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WorkoutsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ApplicationDbContext _context; // 1. Shto këtë variabël
        public WorkoutsController(IMediator mediator,ApplicationDbContext context)
        {
            _mediator = mediator;
            _context = context;
        }

        // 1. MERR TË GJITHA VIDEOT
        [HttpGet("videos")]
        [AllowAnonymous]
        public async Task<IActionResult> GetVideos([FromQuery] GetWorkoutVideosQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        [HttpGet("featured")]
        [AllowAnonymous] // Lejohet që vizitorët ta shohin banerin pa qenë të loguar
        public async Task<IActionResult> GetFeatured()
        {
            var result = await _mediator.Send(new GetFeaturedVideosQuery());
            return Ok(result);
        }
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            // 1. Marrim kategoritë nga tabela ExerciseCategories
            var categories = await _context.ExerciseCategories
                .Select(c => c.Name)
                .Distinct()
                .ToListAsync();
            categories.Insert(0, "All"); // Shtojmë "All" në fillim

            // 2. Marrim vështirësitë unike direkt nga videot
            var difficulties = await _context.WorkoutVideos
                .Where(v => !string.IsNullOrEmpty(v.DifficultyLevel))
                .Select(v => v.DifficultyLevel)
                .Distinct()
                .ToListAsync();
            difficulties.Insert(0, "All");

            // 3. Marrim grupet e muskujve unike direkt nga videot
            var muscleGroups = await _context.WorkoutVideos
                .Where(v => !string.IsNullOrEmpty(v.MuscleGroup))
                .Select(v => v.MuscleGroup)
                .Distinct()
                .ToListAsync();
            muscleGroups.Insert(0, "All");

            // 4. Për Durations (Kohëzgjatjen)
            // Këto janë "intervale" (ranges), ndaj është më mirë t'i lësh hardcoded kështu siç i ke. 
            // Krijimi i intervaleve dinamike nga DB kërkon logjikë të panevojshme dhe ngadalëson API-në.
            var durations = new[] { "All", "< 15 min", "15–30 min", "30–45 min", "45–60 min", "60+ min" };

            // Kthejmë përgjigjen
            return Ok(new
            {
                Categories = categories,
                Difficulties = difficulties,
                MuscleGroups = muscleGroups,
                Durations = durations
            });
        }
        // Endpoint i ri për Continue Watching
        [HttpGet("continue-watching")]
        public async Task<IActionResult> GetContinueWatching()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int loggedInUserId))
            {
                return Unauthorized(new { message = "Përdoruesi nuk është i autorizuar!" });
            }

            var query = new GetContinueWatchingQuery { UserId = loggedInUserId };
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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int loggedInUserId))
            {
                return Unauthorized(new { message = "Përdoruesi nuk është i autorizuar!" });
            }

            command.UserId = loggedInUserId;

            var result = await _mediator.Send(command);

            if (result == null)
            {
                return NotFound(new { message = "Videoja stërvitore nuk u gjet ose nuk ekziston!" });
            }

            return Ok(result);
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