using MediatR;

namespace EliteFit.Application.Features.Roles.Commands.DeleteRole
{
    public record DeleteRoleCommand(int Id) : IRequest<bool>;
}
