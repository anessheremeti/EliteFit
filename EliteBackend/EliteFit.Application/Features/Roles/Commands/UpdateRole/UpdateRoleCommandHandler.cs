using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Roles.Commands.UpdateRole
{
    public class UpdateRoleCommandHandler(IRoleRepository roleRepository)
        : IRequestHandler<UpdateRoleCommand, bool>
    {
        public async Task<bool> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
            => await roleRepository.UpdateAsync(request.Id, request.Name.Trim(), request.Description?.Trim(), cancellationToken);
    }
}
