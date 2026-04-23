namespace EliteFit.Domain.Interfaces.Services
{
    public interface IPasswordService
    {
        string Hash(string password);
        bool Verify(string password, string storedHash);
    }
}
