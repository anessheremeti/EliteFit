using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.DTOs.Media
{
    public record VideoMetadataDto(
          string FilePath,
          long FileSize,
          double DurationInSeconds,
          string Resolution,
          string Codec
      );
}
