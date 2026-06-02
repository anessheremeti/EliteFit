using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Media;
using MediatR;

namespace EliteFit.Application.Features.Media.Commands.ProcessVideo
{
   public record  ProcessVideoCommand(
    
        string InputFilePath,
        string OutputFileName
    
       ): IRequest<VideoMetadataDto>;
}
