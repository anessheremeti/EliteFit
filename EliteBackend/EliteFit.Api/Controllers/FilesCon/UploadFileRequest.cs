using Microsoft.AspNetCore.Http;

namespace EliteFit.Api.Controllers.FilesCon
{
    public class UploadFileRequest
    {
        public IFormFile File { get; set; }
        public string Entity { get; set; }
        public int EntityId { get; set; }
        public int UploaderId { get; set; }
    }
}