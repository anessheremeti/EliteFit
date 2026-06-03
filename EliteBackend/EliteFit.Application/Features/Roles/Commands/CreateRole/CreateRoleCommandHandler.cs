using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Roles.Commands.CreateRole
{
    public class CreateRoleCommandHandler(IRoleRepository roleRepository)
        : IRequestHandler<CreateRoleCommand, int>
    {
        public async Task<int> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
        {
            var role = new Role
            {
                Name        = request.Name.Trim(),
                Description = request.Description?.Trim(),
            };
            await roleRepository.AddAsync(role, cancellationToken);
            await roleRepository.SaveChangesAsync(cancellationToken);
            return role.Id;
        }
    }
}
