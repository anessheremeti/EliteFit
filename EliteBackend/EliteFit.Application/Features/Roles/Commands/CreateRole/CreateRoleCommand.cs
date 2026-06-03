using MediatR;

namespace EliteFit.Application.Features.Roles.Commands.CreateRole
{
    public record CreateRoleCommand(string Name, string? Description) : IRequest<int>;
}
