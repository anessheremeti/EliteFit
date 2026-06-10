using MediatR;

namespace EliteFit.Application.Features.Account.Commands.DeleteAccount
{
    public record DeleteAccountCommand(int UserId) : IRequest<bool>;
}