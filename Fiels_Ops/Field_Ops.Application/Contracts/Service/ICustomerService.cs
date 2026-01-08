using global::Field_Ops.Application.common;
using global::Field_Ops.Application.DTO.CustomerDto;

namespace Field_Ops.Application.Contracts.Service
{
        public interface ICustomerService
        {
            Task<ApiResponse<IEnumerable<CustomerDto>>> GetAllAsync();
            Task<ApiResponse<CustomerDto?>> GetByIdAsync(int id);
            Task<ApiResponse<CustomerDto?>> GetByUserIdAsync(int userId);
        }
    

}
