using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Users.Commands.AssignRoleToUser
{
    public class AssignRoleToUserCommandHandler(IUserRepository userRepository)
        : IRequestHandler<AssignRoleToUserCommand, bool>
    {
        public async Task<bool> Handle(AssignRoleToUserCommand request, CancellationToken cancellationToken)
            => await userRepository.AssignRoleAsync(request.UserId, request.RoleId, cancellationToken);
    }
}
