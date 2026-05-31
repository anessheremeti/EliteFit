using EliteFit.Application.DTOs.Auth;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Services;
using MediatR;
using System.Security.Cryptography;
using System.Text;

namespace EliteFit.Application.Features.Auth.Commands
{
    public record ResetPasswordCommand(ResetPasswordRequest Request) : IRequest<Unit>;

    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Unit>
    {
        private readonly IPasswordResetTokenRepository _tokenRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPasswordService _passwordService;

        public ResetPasswordCommandHandler(
            IPasswordResetTokenRepository tokenRepository,
            IUserRepository userRepository,
            IPasswordService passwordService)
        {
            _tokenRepository = tokenRepository;
            _userRepository = userRepository;
            _passwordService = passwordService;
        }

        public async Task<Unit> Handle(ResetPasswordCommand command, CancellationToken cancellationToken)
        {
            var rawToken = command.Request.Token;
            var tokenHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));

            var resetToken = await _tokenRepository.GetByTokenHashAsync(tokenHash);

            if (resetToken == null || !resetToken.IsValid)
                throw new InvalidOperationException(
                    "This reset link is invalid or has expired. Please request a new one.");

            var user = await _userRepository.GetByIdAsync(resetToken.UserId);

            if (user == null || !user.IsActive)
                throw new InvalidOperationException("User account not found or is inactive.");

            if (_passwordService.Verify(command.Request.NewPassword, user.PasswordHash))
                throw new InvalidOperationException(
                    "New password must be different from your current password.");

            user.PasswordHash = _passwordService.Hash(command.Request.NewPassword);
            resetToken.UsedAt = DateTime.UtcNow;

            await _tokenRepository.SaveChangesAsync();

            return Unit.Value;
        }
    }
}
