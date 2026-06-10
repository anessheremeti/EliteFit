using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Account.Commands.DeleteAccount
{
    public class DeleteAccountCommandHandler : IRequestHandler<DeleteAccountCommand, bool>
    {
        private readonly IUserRepository _repo;
        public DeleteAccountCommandHandler(IUserRepository repo) => _repo = repo;

        public async Task<bool> Handle(DeleteAccountCommand request, CancellationToken ct)
        {
            var user = await _repo.GetByIdAsync(request.UserId);
            if (user == null) return false;

            await _repo.DeleteAsync(request.UserId, ct);
            return true;
        }
    }
}