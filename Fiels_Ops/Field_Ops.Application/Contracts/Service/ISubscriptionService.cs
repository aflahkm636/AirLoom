using Field_ops.Domain.Enums;
using Field_Ops.Application.common;
using Field_Ops.Application.DTO.SubscriptionDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface ISubscriptionService
    {
        Task<ApiResponse<int>> CreateAsync(SubscriptionCreateDto dto, string role, int departmentId);

        Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync(string role, int departmentId);

        Task<ApiResponse<dynamic>> GetByIdAsync(int id, string role, int departmentId);

        Task<ApiResponse<IEnumerable<dynamic>>> GetByCustomerIdAsync(int customerId, string role, int departmentId);

        Task<ApiResponse<bool>> UpdateAsync(SubscriptionUpdateDto dto, string role, int departmentId);

        //Task<ApiResponse<bool>> DeleteAsync(int id, int deletedBy, string role, int departmentId);

        Task<ApiResponse<bool>> PauseAsync(
         int id, int userId, string role, int departmentId);
        Task<ApiResponse<bool>> ResumeAsync(
        int id, int userId, string role, int departmentId);
        Task<ApiResponse<bool>> CancelAsync(
        int id, int userId, string role, int departmentId);
    }

}
