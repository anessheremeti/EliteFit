using EliteFit.Application.Features.Auth.Queries;
using EliteFit.Domain.Interfaces.Repositories.Identity;
using MediatR;

namespace EliteFit.Application.Features.Auth.Commands
{
    public record LogoutCommand(string RefreshToken) : IRequest<Unit>;

    public class LogoutCommandHandler : IRequestHandler<LogoutCommand, Unit>
    {
        private readonly IRefreshTokenRepository _refreshTokens;

        public LogoutCommandHandler(IRefreshTokenRepository refreshTokens)
            => _refreshTokens = refreshTokens;

        public async Task<Unit> Handle(LogoutCommand command, CancellationToken ct)
        {
            var hash   = LoginQueryHandler.Hash(command.RefreshToken);
            var stored = await _refreshTokens.GetActiveByTokenHashAsync(hash);

            if (stored is not null && stored.RevokedAt is null)
            {
                stored.RevokedAt = DateTime.UtcNow;
                await _refreshTokens.SaveChangesAsync();
            }

            return Unit.Value;
        }
    }
}
