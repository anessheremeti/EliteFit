using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Users.Commands.SetUserActiveStatus
{
    public class SetUserActiveStatusCommandHandler(IUserRepository userRepository)
        : IRequestHandler<SetUserActiveStatusCommand, bool>
    {
        public async Task<bool> Handle(SetUserActiveStatusCommand request, CancellationToken cancellationToken)
            => await userRepository.SetActiveStatusAsync(request.UserId, request.IsActive, cancellationToken);
    }
}
