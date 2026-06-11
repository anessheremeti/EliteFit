using EliteFit.Domain.Interfaces.Services;
using EliteFit.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace EliteFit.Infrastructure.Services
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly JwtSettings _settings;

        public JwtTokenService(IOptions<JwtSettings> settings)
        {
            _settings = settings.Value;
        }

        public int AccessTokenExpiryMinutes  => _settings.ExpiryMinutes;
        public int RefreshTokenExpiryDays    => _settings.RefreshTokenExpiryDays;

        public string GenerateToken(int userId, string email, string fullName, IEnumerable<string> roles)
        {
            var key         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                new(ClaimTypes.Email,          email),
                new(ClaimTypes.Name,           fullName),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var token = new JwtSecurityToken(
                issuer:            _settings.Issuer,
                audience:          _settings.Audience,
                claims:            claims,
                expires:           DateTime.UtcNow.AddMinutes(_settings.ExpiryMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // 64 cryptographically random bytes → URL-safe base64 string.
        public string GenerateRefreshToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(bytes);
        }
    }
}
