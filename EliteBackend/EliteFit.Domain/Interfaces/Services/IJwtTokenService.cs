namespace EliteFit.Domain.Interfaces.Services
{
    public interface IJwtTokenService
    {
        string GenerateToken(int userId, string email, string fullName);
    }
}
