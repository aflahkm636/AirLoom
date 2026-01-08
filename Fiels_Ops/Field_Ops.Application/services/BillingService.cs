using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.BIllingDto;
using Microsoft.Extensions.Logging;

namespace Field_Ops.Application.Service
{
    public class BillingService : IBillingService
    {
        private readonly IBillingRepository _billingRepository;
        private readonly IPdfService _pdfService;
        private readonly IEmailService _emailService;
        private readonly ILogger<BillingService> _logger;


        public BillingService(
            IBillingRepository billingRepository,
            IPdfService pdfService,
            IEmailService emailService ,ILogger<BillingService> logger)
        {
            _billingRepository = billingRepository;
            _pdfService = pdfService;
            _emailService = emailService;
            _logger = logger;
        }



        public async Task<ApiResponse<IEnumerable<dynamic>>> GetPendingAsync()
        {
            var bills = await _billingRepository.GetPendingAsync();

            return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
                200,
                "Pending bills fetched successfully.",
                bills
            );
        }

        public async Task<ApiResponse<dynamic?>> GetByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid Bill Id.");

            var bill = await _billingRepository.GetByIdAsync(id);

            return ApiResponse<dynamic?>.SuccessResponse(
                200,
                bill == null ? "Bill not found." : "Bill fetched successfully.",
                bill
            );
        }

        public async Task<ApiResponse<IEnumerable<dynamic>>> GetByCustomerAsync(int customerId)
        {
            if (customerId <= 0)
                throw new ArgumentException("Invalid Customer Id.");

            var bills = await _billingRepository.GetByCustomerAsync(customerId);

            return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
                200,
                "Customer bills fetched successfully.",
                bills
            );
        }

     

        public async Task<ApiResponse<BillingDto>> UpdateDiscountAsync(
            BillingDiscountUpdateDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (dto.BillingId <= 0)
                throw new ArgumentException("Invalid Bill Id.");

            if (dto.DiscountPercent < 0 || dto.DiscountPercent > 100)
                throw new ArgumentException("Invalid discount percent.");

            var updatedBill = await _billingRepository.UpdateDiscountAsync(dto);

            return ApiResponse<BillingDto>.SuccessResponse(
                200,
                "Discount updated successfully.",
                updatedBill
            );
        }

        public async Task<ApiResponse<BillingDto>> FinalizeAsync(
            int billId,
            int actionUserId)
        {
            if (billId <= 0)
                throw new ArgumentException("Invalid Bill Id.");

            if (actionUserId <= 0)
                throw new ArgumentException("Invalid Action User.");

            var finalizedBill = await _billingRepository.FinalizeAsync(
                billId,
                actionUserId
            );

            if (finalizedBill == null)
                throw new InvalidOperationException("Bill finalization failed.");

            var invoiceData = await _billingRepository.GetInvoiceDataAsync(billId);

            if (invoiceData == null)
                throw new InvalidOperationException("Invoice data not found.");

            var pdfBytes = _pdfService.GenerateInvoicePdf(invoiceData);

            try
            {
                string subject = $"Invoice - {invoiceData.InvoiceNumber}";
                string body = $@"
            <h3>Hello {invoiceData.CustomerName},</h3>
            <p>Your invoice for <b>{invoiceData.BillMonth:MMMM yyyy}</b>
            has been generated.</p>
            <p>Please find the attached invoice PDF.</p>
            <p>Regards,<br/>Field_Ops Team</p>";

                bool emailSent = await _emailService.SendEmailAsync(
                    invoiceData.CustomerEmail,
                    subject,
                    body,
                    pdfBytes,
                    $"Invoice_{invoiceData.InvoiceNumber}.pdf"
                );

                if (!emailSent)
                {
                    _logger.LogWarning(
                        "Invoice email NOT sent. BillId={BillId}, Email={Email}",
                        billId,
                        invoiceData.CustomerEmail
                    );
                }
                else
                {
                    _logger.LogInformation(
                        "Invoice email sent successfully. BillId={BillId}, Email={Email}",
                        billId,
                        invoiceData.CustomerEmail
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Invoice email failed unexpectedly. BillId={BillId}, Email={Email}",
                    billId,
                    invoiceData.CustomerEmail
                );
            }

            return ApiResponse<BillingDto>.SuccessResponse(
                200,
                "Bill finalized successfully.",
                finalizedBill
            );
        }

        

        public async Task<ApiResponse<bool>> RegenerateAsync(
            int billId,
            int actionUserId)
        {
            if (billId <= 0)
                throw new ArgumentException("Invalid Bill Id.");

            if (actionUserId <= 0)
                throw new ArgumentException("Invalid Action User.");

            await _billingRepository.RegenerateAsync(billId, actionUserId);

            return ApiResponse<bool>.SuccessResponse(
                200,
                "Bill regenerated successfully.",
                true
            );
        }
    }
}
