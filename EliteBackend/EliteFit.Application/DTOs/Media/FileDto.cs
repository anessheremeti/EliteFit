using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Media
{
    public record FileDto(
        int Id,
        string Filename,
        string FilePath,
        long? FileSize,
        string? Entity,
        int? EntityId
    );
}