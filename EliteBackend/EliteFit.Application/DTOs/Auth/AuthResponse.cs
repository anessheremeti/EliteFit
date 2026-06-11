namespace EliteFit.Application.DTOs.Auth
{
    public record AuthResponse(
        string       Token,
        string       RefreshToken,
        string       Email,
        string       FullName,
        DateTime     ExpiresAt,
        List<string> Roles
    );
}
