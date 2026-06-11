using EliteFit.Application.DTOs.Auth;
using EliteFit.Application.Features.Auth.Queries;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Repositories.Identity;
using EliteFit.Domain.Interfaces.Services;
using MediatR;
using System.Text;

namespace EliteFit.Application.Features.Auth.Commands
{
    public record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResponse>;

    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
    {
        private readonly IRefreshTokenRepository _refreshTokens;
        private readonly IUserRepository         _users;
        private readonly IJwtTokenService        _jwt;

        public RefreshTokenCommandHandler(
            IRefreshTokenRepository refreshTokens,
            IUserRepository         users,
            IJwtTokenService        jwt)
        {
            _refreshTokens = refreshTokens;
            _users         = users;
            _jwt           = jwt;
        }

        public async Task<AuthResponse> Handle(RefreshTokenCommand command, CancellationToken ct)
        {
            var hash   = LoginQueryHandler.Hash(command.RefreshToken);
            var stored = await _refreshTokens.GetActiveByTokenHashAsync(hash);

            // Token not found → invalid
            if (stored is null)
                throw new UnauthorizedAccessException("Invalid refresh token.");

            // Token was already revoked → possible theft → revoke ALL sessions for this user
            if (stored.RevokedAt is not null)
            {
                await _refreshTokens.RevokeAllForUserAsync(stored.UserId);
                await _refreshTokens.SaveChangesAsync();
                throw new UnauthorizedAccessException("Refresh token reuse detected. All sessions have been revoked.");
            }

            // Token expired
            if (stored.ExpiresAt < DateTime.UtcNow)
                throw new UnauthorizedAccessException("Refresh token has expired. Please log in again.");

            // Load user with roles for new JWT
            var user = await _users.GetByIdWithRolesAsync(stored.UserId);
            if (user is null || !user.IsActive)
                throw new UnauthorizedAccessException("User account not found or deactivated.");

            // Rotate: revoke old, issue new pair
            stored.RevokedAt = DateTime.UtcNow;

            var roles       = user.UserRoles?.Select(ur => ur.Role!.Name).ToList() ?? [];
            var newAccess   = _jwt.GenerateToken(user.Id, user.Email!, $"{user.FirstName} {user.LastName}", roles);
            var newRaw      = _jwt.GenerateRefreshToken();

            await _refreshTokens.AddAsync(new RefreshToken
            {
                UserId    = user.Id,
                TokenHash = LoginQueryHandler.Hash(newRaw),
                ExpiresAt = DateTime.UtcNow.AddDays(_jwt.RefreshTokenExpiryDays),
                CreatedAt = DateTime.UtcNow,
            });
            await _refreshTokens.SaveChangesAsync();

            return new AuthResponse(
                newAccess,
                newRaw,
                user.Email!,
                $"{user.FirstName} {user.LastName}",
                DateTime.UtcNow.AddMinutes(_jwt.AccessTokenExpiryMinutes),
                roles);
        }
    }
}
