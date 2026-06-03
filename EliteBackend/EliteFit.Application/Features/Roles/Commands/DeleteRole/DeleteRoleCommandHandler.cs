using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Roles.Commands.DeleteRole
{
    public class DeleteRoleCommandHandler(IRoleRepository roleRepository)
        : IRequestHandler<DeleteRoleCommand, bool>
    {
        public async Task<bool> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
            => await roleRepository.DeleteAsync(request.Id, cancellationToken);
    }
}
