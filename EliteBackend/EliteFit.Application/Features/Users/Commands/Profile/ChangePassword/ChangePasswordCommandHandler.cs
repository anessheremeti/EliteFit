using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Services; // Sigurohu që ke këtë using
using MediatR;

namespace EliteFit.Application.Features.Users.Commands.Profile.ChangePassword
{
    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
    {
        private readonly IUserRepository _repo;
        private readonly IPasswordService _passwordService; // Injektojmë shërbimin

        public ChangePasswordCommandHandler(IUserRepository repo, IPasswordService passwordService)
        {
            _repo = repo;
            _passwordService = passwordService;
        }

        public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken ct)
        {
            var user = await _repo.GetByIdAsync(request.UserId);
            if (user == null) throw new Exception("User not found.");

            // Përdorim metodat e shërbimit në vend të BCrypt direkt
            if (!_passwordService.Verify(request.CurrentPassword, user.PasswordHash))
                throw new Exception("Incorrect password.");

            user.PasswordHash = _passwordService.Hash(request.NewPassword);

            _repo.Update(user);
            await _repo.SaveChangesAsync();

            return true;
        }
    }
}