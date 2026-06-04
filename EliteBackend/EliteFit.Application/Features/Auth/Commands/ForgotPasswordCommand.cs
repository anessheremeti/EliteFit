using EliteFit.Application.DTOs.Auth;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Services;
using MediatR;
using System.Security.Cryptography;
using System.Text;

namespace EliteFit.Application.Features.Auth.Commands
{
    public record ForgotPasswordCommand(ForgotPasswordRequest Request, string FrontendBaseUrl) : IRequest<string?>;

    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, string?>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordResetTokenRepository _tokenRepository;
        private readonly IEmailService _emailService;

        public ForgotPasswordCommandHandler(
            IUserRepository userRepository,
            IPasswordResetTokenRepository tokenRepository,
            IEmailService emailService)
        {
            _userRepository = userRepository;
            _tokenRepository = tokenRepository;
            _emailService = emailService;
        }

        public async Task<string?> Handle(ForgotPasswordCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByEmailAsync(command.Request.Email.ToLowerInvariant());

            // Silently succeed even if email doesn't exist (prevents email enumeration)
            if (user == null || !user.IsActive)
                return null;

            // Invalidate any previous tokens for this user
            await _tokenRepository.InvalidateExistingTokensAsync(user.Id);

            // Generate cryptographically secure 32-byte random token
            var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            var tokenHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));

            var resetToken = new PasswordResetToken
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddMinutes(30),
            };

            await _tokenRepository.AddAsync(resetToken);
            await _tokenRepository.SaveChangesAsync();

            var resetLink = $"{command.FrontendBaseUrl}/reset-password?token={Uri.EscapeDataString(rawToken)}";
            var devLink = await _emailService.SendPasswordResetEmailAsync(
                user.Email,
                $"{user.FirstName} {user.LastName}",
                resetLink);

            // devLink is non-null only when Email:Enabled = false (dev mode)
            return devLink;
        }
    }
}
