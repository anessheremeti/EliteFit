using MediatR;

namespace EliteFit.Application.Features.Roles.Commands.UpdateRole
{
    public record UpdateRoleCommand(int Id, string Name, string? Description) : IRequest<bool>;
}
