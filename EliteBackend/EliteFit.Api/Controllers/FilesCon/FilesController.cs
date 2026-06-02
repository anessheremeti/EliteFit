using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EliteFit.Application.Features.Media.Commands.UploadFile;
using EliteFit.Application.Features.Media.Commands.DeleteFile;
using EliteFit.Application.Features.Media.Queries.GetFileById;
using EliteFit.Application.Features.Media.Queries.GetFilesByEntity;

namespace EliteFit.Api.Controllers.FilesCon
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FilesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] UploadFileRequest request)
        {
            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest("Asnjë fajll nuk u dërgua");
            }

            // Hapim stream-in nga IFormFile i objektit request
            using (var stream = request.File.OpenReadStream())
            {
                // Krijojmë komandën e shtresës Application duke kaluar vlerat nga request
                var command = new UploadFileCommand(
                    stream,
                    request.File.FileName,
                    request.Entity,
                    request.EntityId,
                    request.UploaderId
                );

                var fileId = await _mediator.Send(command);

                return Ok(new { Message = "Fajlli u ngarkua dhe u procesua me sukses!", FileId = fileId });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var file = await _mediator.Send(new GetFileByIdQuery(id));
            if (file == null) return NotFound();
            return Ok(file);
        }

        [HttpGet("entity/{entity}/{entityId}")]
        public async Task<IActionResult> GetByEntity(string entity, int entityId)
        {
            var files = await _mediator.Send(new GetFilesByEntityQuery(entity, entityId));
            return Ok(files);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteFileCommand(id));
            if (!result) return NotFound(new { Message = "Fajlli nuk u gjet ose dështoi fshirja fizike." });
            return Ok(new { Message = "Fajlli u fshi me sukses nga serveri dhe databaza!" });
        }
    }
}