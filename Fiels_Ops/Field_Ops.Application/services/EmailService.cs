using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    /* ------------------------------
       NORMAL EMAIL (NO ATTACHMENT)
    ------------------------------ */
    public async Task<bool> SendEmailAsync(
        string to,
        string subject,
        string htmlBody)
    {
        return await SendInternalAsync(
            to,
            subject,
            htmlBody,
            null,
            null
        );
    }


    public async Task<bool> SendEmailAsync(
        string to,
        string subject,
        string htmlBody,
        byte[] attachmentBytes,
        string attachmentName)
    {
        return await SendInternalAsync(
            to,
            subject,
            htmlBody,
            attachmentBytes,
            attachmentName
        );
    }

   
    private async Task<bool> SendInternalAsync(
        string to,
        string subject,
        string htmlBody,
        byte[]? attachmentBytes,
        string? attachmentName)
    {
        var email = new MimeMessage();
        email.From.Add(
            new MailboxAddress("FieldOps_ERP", _settings.From)
        );
        email.To.Add(MailboxAddress.Parse(to));
        email.Subject = subject;

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = htmlBody
        };

        if (attachmentBytes != null)
        {
            bodyBuilder.Attachments.Add(
                attachmentName!,
                attachmentBytes,
                ContentType.Parse("application/pdf")
            );
        }

        email.Body = bodyBuilder.ToMessageBody();

        using var smtp = new SmtpClient();

        try
        {
            await smtp.ConnectAsync(
                _settings.Host,
                _settings.Port,
                SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(
                _settings.Username,
                _settings.Password
            );

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            return true;
        }
        catch (Exception ex)
        {
            // ⚠️ In real ERP → log this
            Console.WriteLine("SMTP ERROR: " + ex.Message);
            return false;
        }
    }
}
