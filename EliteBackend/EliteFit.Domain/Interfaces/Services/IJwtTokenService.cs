namespace EliteFit.Domain.Interfaces.Services
{
    public interface IJwtTokenService
    {
        string GenerateToken(int userId, string email, string fullName, IEnumerable<string> roles);

        // Generates a cryptographically random opaque string (64 bytes, base64).
        // Never stored raw — callers must hash before persisting.
        string GenerateRefreshToken();

        int AccessTokenExpiryMinutes { get; }
        int RefreshTokenExpiryDays   { get; }
    }
}
