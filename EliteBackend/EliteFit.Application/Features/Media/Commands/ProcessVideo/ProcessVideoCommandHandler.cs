using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Media;
using MediatR;
using Microsoft.Extensions.Logging;
namespace EliteFit.Application.Features.Media.Commands.ProcessVideo
{
    public class ProcessVideoCommandHandler : IRequestHandler<ProcessVideoCommand, VideoMetadataDto>
    {
        public async Task<VideoMetadataDto> Handle(ProcessVideoCommand request, CancellationToken cancellationToken)
        {
            if (!File.Exists(request.InputFilePath))
                throw new ArgumentException("Videoja orgjinale nuk u gjet");

            string baseDir = AppContext.BaseDirectory;
            string videoFolder = Path.Combine(baseDir, "wwwroot", "uploads", "videos");

            if (!Directory.Exists(videoFolder))
            {
                Directory.CreateDirectory(videoFolder);
            }
            string uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(request.OutputFileName)}.mp4";
            string outputFilePath = Path.Combine(videoFolder, uniqueFileName);

            string arguments = $"-i \"{request.InputFilePath}\" -c:v libx264 -crf 23 -profile:v baseline -level 3.0 -pix_fmt yuv420p -c:a aac -ac 2 -b:a 128k -movflags +faststart \"{outputFilePath}\" -y";

            var startInfo = new ProcessStartInfo
            {
                FileName = "ffmpeg",
                Arguments = arguments,
                RedirectStandardError = true,
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            using (var process = new Process {StartInfo = startInfo })
            {
                process.Start();
                string errors = await process.StandardError.ReadToEndAsync(cancellationToken);
                await process.WaitForExitAsync(cancellationToken);

                if (process.ExitCode != 0)
                {
                    throw new Exception($"Deshtoi procesimi i videos:{errors}");
                }
            }
            try
            {
                if (File.Exists(request.InputFilePath)) File.Delete(request.InputFilePath);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Nuk u fshi file-i: {ex.Message}");
            }
            var fileInfo = new FileInfo(outputFilePath);

            return new VideoMetadataDto(
                     FilePath: $"/uploads/videos/{uniqueFileName}",
                     FileSize: fileInfo.Length,
                     DurationInSeconds: 0, // Kjo mund të nxirret me ffprobe nëse kërkohet saktësi sekondash
                     Resolution: "1080p",
                     Codec: "H.264"
                 );

        }


    } 
}
