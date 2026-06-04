namespace EliteFit.Domain.Interfaces.Services
{
    public interface IEmailService
    {
        /// <summary>
        /// Sends the password reset email.
        /// Returns the reset link when email is disabled (dev mode) so the caller
        /// can surface it to the developer; returns null in production.
        /// </summary>
        Task<string?> SendPasswordResetEmailAsync(string toEmail, string toName, string resetLink);
    }
}
