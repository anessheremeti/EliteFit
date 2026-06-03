using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Users.Commands.RemoveRoleFromUser
{
    public class RemoveRoleFromUserCommandHandler(IUserRepository userRepository)
        : IRequestHandler<RemoveRoleFromUserCommand, bool>
    {
        public async Task<bool> Handle(RemoveRoleFromUserCommand request, CancellationToken cancellationToken)
            => await userRepository.RemoveRoleAsync(request.UserId, request.RoleId, cancellationToken);
    }
}
