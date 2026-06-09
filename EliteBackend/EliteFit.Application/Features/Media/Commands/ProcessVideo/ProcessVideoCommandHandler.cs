using System;
using System.IO;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Media;
using MediatR;

namespace EliteFit.Application.Features.Media.Commands.ProcessVideo
{
    public class ProcessVideoCommandHandler : IRequestHandler<ProcessVideoCommand, VideoMetadataDto>
    {
        public async Task<VideoMetadataDto> Handle(ProcessVideoCommand request, CancellationToken cancellationToken)
        {
            if (!File.Exists(request.InputFilePath))
                throw new ArgumentException("Videoja origjinale nuk u gjet");

            // RREGULLIMI: Përdorim GetCurrentDirectory() që të mos ngatërrohet me folderin /bin/
            string baseDir = Directory.GetCurrentDirectory();
            string videoFolder = Path.Combine(baseDir, "wwwroot", "uploads", "videos");

            if (!Directory.Exists(videoFolder))
            {
                Directory.CreateDirectory(videoFolder);
            }

            string uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(request.OutputFileName)}.mp4";
            string outputFilePath = Path.Combine(videoFolder, uniqueFileName);

            // Parametrat për FFmpeg
            string arguments = $"-loglevel error -y -i \"{request.InputFilePath}\" -c:v libx264 -preset ultrafast -crf 28 -profile:v baseline -level 3.0 -pix_fmt yuv420p -c:a aac -ac 2 -b:a 128k -movflags +faststart \"{outputFilePath}\"";

            var startInfo = new ProcessStartInfo
            {
                FileName = @"C:\ffmpeg-2026-06-08-git-6028720d70-essentials_build\bin\ffmpeg.exe",
                Arguments = arguments,
                RedirectStandardError = true,
                RedirectStandardOutput = false,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            using (var process = new Process { StartInfo = startInfo })
            {
                process.Start();

                // Presim që FFmpeg të kryejë punën e tij
                await process.WaitForExitAsync(cancellationToken);

                if (process.ExitCode != 0)
                {
                    string errors = await process.StandardError.ReadToEndAsync(cancellationToken);
                    throw new Exception($"Dështoi procesimi i videos. Kodi i daljes: {process.ExitCode}. Detajet: {errors}");
                }
            }

            // Fshirja e skedarit të përkohshëm (Temp) pas procesimit të suksesshëm
            try
            {
                if (File.Exists(request.InputFilePath))
                    File.Delete(request.InputFilePath);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Nuk u fshi file-i temp: {ex.Message}");
            }

            var fileInfo = new FileInfo(outputFilePath);

            return new VideoMetadataDto(
                FilePath: $"/uploads/videos/{uniqueFileName}",
                FileSize: fileInfo.Length,
                DurationInSeconds: 0,
                Resolution: "1080p",
                Codec: "H.264"
            );
        }
    }
}