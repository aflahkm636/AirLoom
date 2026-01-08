using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.CustomerDto;

namespace Field_Ops.Application.Service
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _repo;

        public CustomerService(ICustomerRepository repo)
        {
            _repo = repo;
        }

        public async Task<ApiResponse<IEnumerable<CustomerDto>>> GetAllAsync()
        {
            var customers = await _repo.GetAllAsync();

            return ApiResponse<IEnumerable<CustomerDto>>.SuccessResponse(
                200,
                "Customers fetched successfully.",
                customers
            );
        }


        public async Task<ApiResponse<CustomerDto?>> GetByIdAsync(int id)
        {
            if (id <= 0) throw new ArgumentException("Invalid Customer Id.");

            var customer = await _repo.GetByIdAsync(id);

            return ApiResponse<CustomerDto?>.SuccessResponse(
                200,
                customer != null ? "Customer fetched successfully." : "Customer not found.",
                customer
            );
        }


        public async Task<ApiResponse<CustomerDto?>> GetByUserIdAsync(int userId)
        {
            if (userId <= 0) throw new ArgumentException("Invalid UserId.");

            var customer = await _repo.GetByUserIdAsync(userId);

            return ApiResponse<CustomerDto?>.SuccessResponse(
                200,
                customer != null ? "Customer fetched successfully." : "Customer not found.",
                customer
            );
        }


       
    }
}
