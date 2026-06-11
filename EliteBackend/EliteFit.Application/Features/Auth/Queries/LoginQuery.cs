using EliteFit.Application.DTOs.Auth;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Repositories.Identity;
using EliteFit.Domain.Interfaces.Services;
using MediatR;
using System.Security.Cryptography;
using System.Text;

namespace EliteFit.Application.Features.Auth.Queries
{
    public record LoginQuery(LoginRequest Request) : IRequest<AuthResponse>;

    public class LoginQueryHandler : IRequestHandler<LoginQuery, AuthResponse>
    {
        private readonly IUserRepository          _users;
        private readonly IPasswordService         _passwords;
        private readonly IJwtTokenService         _jwt;
        private readonly IRefreshTokenRepository  _refreshTokens;

        public LoginQueryHandler(
            IUserRepository         users,
            IPasswordService        passwords,
            IJwtTokenService        jwt,
            IRefreshTokenRepository refreshTokens)
        {
            _users         = users;
            _passwords     = passwords;
            _jwt           = jwt;
            _refreshTokens = refreshTokens;
        }

        public async Task<AuthResponse> Handle(LoginQuery query, CancellationToken ct)
        {
            var req  = query.Request;
            var user = await _users.GetByEmailAsync(req.Email.ToLowerInvariant());

            if (user is null || !_passwords.Verify(req.Password, user.PasswordHash!))
                throw new UnauthorizedAccessException("Invalid email or password.");

            if (!user.IsActive)
                throw new UnauthorizedAccessException("Your account has been deactivated.");

            var roles        = user.UserRoles?.Select(ur => ur.Role!.Name).ToList() ?? [];
            var accessToken  = _jwt.GenerateToken(user.Id, user.Email!, $"{user.FirstName} {user.LastName}", roles);
            var rawRefresh   = _jwt.GenerateRefreshToken();

            await _refreshTokens.AddAsync(new RefreshToken
            {
                UserId    = user.Id,
                TokenHash = Hash(rawRefresh),
                ExpiresAt = DateTime.UtcNow.AddDays(_jwt.RefreshTokenExpiryDays),
                CreatedAt = DateTime.UtcNow,
            });
            await _refreshTokens.SaveChangesAsync();

            return new AuthResponse(
                accessToken,
                rawRefresh,
                user.Email!,
                $"{user.FirstName} {user.LastName}",
                DateTime.UtcNow.AddMinutes(_jwt.AccessTokenExpiryMinutes),
                roles);
        }

        internal static string Hash(string raw)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
            return Convert.ToBase64String(bytes);
        }
    }
}
