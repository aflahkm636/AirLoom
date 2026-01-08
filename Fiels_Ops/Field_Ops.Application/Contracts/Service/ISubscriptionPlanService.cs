using Field_Ops.Application.common;
using Field_Ops.Application.DTO.SubscriptionPlanDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface ISubscriptionPlanService
    {
        Task<ApiResponse<int>> CreateAsync(SubscriptionPlanCreateDto dto);
        Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync();
        Task<ApiResponse<dynamic>> GetByIdAsync(int id);
        Task<ApiResponse<bool>> UpdateAsync(SubscriptionPlanUpdateDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id, int deletedBy);
    }

}
