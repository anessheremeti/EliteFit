using MediatR;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Domain.Interfaces.Repositories.Workout;
using EliteFit.Application.Features.Media.Commands.DeleteFile;

namespace EliteFit.Application.Features.Workouts.Commands.DeleteWorkoutVideo
{
    public class DeleteWorkoutVideoCommandHandler : IRequestHandler<DeleteWorkoutVideoCommand, bool>
    {
        private readonly IWorkoutVideoRepository _workoutRepository;
        private readonly IMediator _mediator;

        public DeleteWorkoutVideoCommandHandler(IWorkoutVideoRepository workoutRepository, IMediator mediator)
        {
            _workoutRepository = workoutRepository;
            _mediator = mediator;
        }

        public async Task<bool> Handle(DeleteWorkoutVideoCommand request, CancellationToken cancellationToken)
        {
            var video = await _workoutRepository.GetByIdAsync(request.Id, cancellationToken);
            if (video == null) return false;

            // 1. Nëse stërvitja ka një video të lidhur, e fshijmë atë fizikisht nga wwwroot dhe tabela e mediave
            // 1. Nëse stërvitja ka një video të lidhur, e fshijmë atë fizikisht
            if (video.VideoFileId.HasValue)
            {
                // Përdorim konstruktorin me parametër: new DeleteFileCommand(int id)
                var deleteCommand = new DeleteFileCommand(video.VideoFileId.Value);
                await _mediator.Send(deleteCommand, cancellationToken);
            }
            // 2. Fshijmë rekordin e WorkoutVideo nga databaza
            await _workoutRepository.DeleteAsync(video, cancellationToken);

            return true;
        }
    }
}