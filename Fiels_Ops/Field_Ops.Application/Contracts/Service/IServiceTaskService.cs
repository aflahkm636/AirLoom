using Field_ops.Domain.Enums;
using Field_Ops.Application.common;
using Field_Ops.Application.DTO;


namespace Field_Ops.Application.Contracts.Service
{
   

    public interface IServiceTasksService
    {
        Task<ApiResponse<int>> CreateAsync(ServiceTaskCreateDto dto);
        Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync();
        Task<ApiResponse<dynamic?>> GetByIdAsync(int id);
        Task<ApiResponse<bool>> UpdateAsync(ServiceTaskUpdateDto dto);
        Task<ApiResponse<bool>> UpdateStatusAsync(ServiceTaskUpdateStatusDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id, int actionUserId);

        Task<ApiResponse<IEnumerable<dynamic>>> GetTasksByCustomerAsync(int actionUserId);
        Task <ApiResponse<IEnumerable<dynamic>>> GetTasksByStatusAsync(ServiceTaskStatus status);
        Task<ApiResponse<IEnumerable<dynamic>>> GetTasksByTechnicianAsync(int employeeId);
        Task <ApiResponse<IEnumerable<dynamic>>> GetTasksBySubscriptionIdAsync(int subscriptionId);

        Task<ApiResponse<IEnumerable<dynamic>>> GetAwaitingApprovalAsync(int actionUserId);
    }

}
