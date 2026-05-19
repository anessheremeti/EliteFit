using EliteFit.Domain.Interfaces.Services;
using EliteFit.Infrastructure.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace EliteFit.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> settings, ILogger<EmailService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string toName, string resetLink)
        {
            // Always log the link so devs can test without SMTP configured
            _logger.LogInformation(
                "[EliteFit] Password reset link for {Email}: {Link}", toEmail, resetLink);

            if (!_settings.Enabled)
            {
                _logger.LogWarning(
                    "Email service is disabled (Email:Enabled = false). " +
                    "Set it to true and configure SMTP to send real emails.");
                return;
            }

            var subject = "Reset your EliteFit password";
            var body = BuildResetEmailHtml(toName, resetLink);

            using var message = new MailMessage
            {
                From = new MailAddress(_settings.FromEmail, _settings.FromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(new MailAddress(toEmail, toName));

#pragma warning disable SYSLIB0006
            using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
            {
                Credentials = new NetworkCredential(_settings.Username, _settings.Password),
                EnableSsl = _settings.EnableSsl
            };

            try
            {
                await client.SendMailAsync(message);
                _logger.LogInformation("Password reset email sent to {Email}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", toEmail);
                // Don't rethrow — the token is already saved; user can retry
            }
#pragma warning restore SYSLIB0006
        }

        private static string BuildResetEmailHtml(string name, string resetLink)
        {
            return $"""
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1"/>
                </head>
                <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
                    <tr><td align="center">
                      <table width="560" cellpadding="0" cellspacing="0"
                             style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
                        <!-- Header -->
                        <tr>
                          <td style="background:linear-gradient(135deg,#ec4899,#db2777);padding:36px 40px;text-align:center;">
                            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                              EliteFit
                            </h1>
                          </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                          <td style="padding:40px;">
                            <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;">
                              Reset your password
                            </h2>
                            <p style="margin:0 0 8px;color:#6b7280;font-size:15px;line-height:1.6;">
                              Hi {name},
                            </p>
                            <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;">
                              We received a request to reset the password for your EliteFit account.
                              Click the button below to choose a new password. This link expires in
                              <strong style="color:#111827;">30 minutes</strong>.
                            </p>
                            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                              <tr>
                                <td style="border-radius:50px;background:linear-gradient(135deg,#ec4899,#db2777);">
                                  <a href="{resetLink}"
                                     style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;
                                            font-weight:600;text-decoration:none;border-radius:50px;">
                                    Reset Password
                                  </a>
                                </td>
                              </tr>
                            </table>
                            <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;">
                              Or copy and paste this link into your browser:
                            </p>
                            <p style="margin:0 0 28px;word-break:break-all;">
                              <a href="{resetLink}" style="color:#ec4899;font-size:13px;">{resetLink}</a>
                            </p>
                            <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 24px;"/>
                            <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
                              If you didn't request a password reset, you can safely ignore this email.
                              Your password won't change until you click the link above.
                            </p>
                          </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                          <td style="padding:20px 40px;background:#f9fafb;text-align:center;">
                            <p style="margin:0;color:#9ca3af;font-size:12px;">
                              &copy; 2026 EliteFit. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """;
        }
    }
}
