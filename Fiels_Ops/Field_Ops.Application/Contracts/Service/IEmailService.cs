using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(
            string to,
            string subject,
            string htmlBody
        );

        Task<bool> SendEmailAsync(
            string to,
            string subject,
            string htmlBody,
            byte[] attachmentBytes,
            string attachmentName
        );
    }
}
