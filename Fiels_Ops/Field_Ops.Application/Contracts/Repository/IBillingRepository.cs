using Field_Ops.Application.DTO.BIllingDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface IBillingRepository
    {
        Task GenerateAsync(int subscriptionId, DateTime billMonth, int systemUserId);
        Task<IEnumerable<dynamic>> GetPendingAsync();
        Task<dynamic?> GetByIdAsync(int id);
        Task<IEnumerable<dynamic>> GetByCustomerAsync(int customerId);
        Task<BillingDto> UpdateDiscountAsync(BillingDiscountUpdateDto dto);
        Task<BillingDto> FinalizeAsync(int billingId, int adminUserId);
        Task<bool> RegenerateAsync(int billId, int actionUserId);
        Task<InvoicePdfDto?> GetInvoiceDataAsync(int billId);


    }

}
