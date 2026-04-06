using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class FileEntity : BaseEntity
    {
        public string? Entity { get; set; }
        public int? EntityId { get; set; }

        public string Filename { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long? FileSize { get; set; }

        public int? UploadedBy { get; set; }

        public User? Uploader { get; set; }
    }
}
