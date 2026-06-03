using MediatR;

namespace EliteFit.Application.Features.Users.Commands.SetUserActiveStatus
{
    public record SetUserActiveStatusCommand(int UserId, bool IsActive) : IRequest<bool>;
}
