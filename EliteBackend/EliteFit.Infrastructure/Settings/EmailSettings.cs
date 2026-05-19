namespace EliteFit.Infrastructure.Settings
{
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = "smtp.gmail.com";
        public int SmtpPort { get; set; } = 587;
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public string FromName { get; set; } = "EliteFit";
        public string FromEmail { get; set; } = "noreply@elitefit.com";
        public bool EnableSsl { get; set; } = true;
        // When false, reset links are only logged — useful for local development
        public bool Enabled { get; set; } = false;
    }
}
