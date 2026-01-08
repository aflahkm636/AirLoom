using Field_Ops.Application.common;
using Field_Ops.Application.DTO.BIllingDto;


namespace Field_Ops.Application.Contracts.Service
{
    public interface IBillingService
    {
        Task<ApiResponse<IEnumerable<dynamic>>> GetPendingAsync();
        Task<ApiResponse<dynamic?>> GetByIdAsync(int id);
        Task<ApiResponse<IEnumerable<dynamic>>> GetByCustomerAsync(int customerId);

        Task<ApiResponse<BillingDto>> UpdateDiscountAsync(BillingDiscountUpdateDto dto);
        Task<ApiResponse<BillingDto>> FinalizeAsync(int billId, int actionUserId);
        Task<ApiResponse<bool>> RegenerateAsync(int billId, int actionUserId);
    }

}
