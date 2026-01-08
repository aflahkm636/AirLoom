using Field_Ops.Application.common;
using Field_Ops.Application.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface IComplaintsService
    {
        Task<ApiResponse<int>> CreateAsync(ComplaintCreateDto dto);
        Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync();
        Task<ApiResponse<dynamic?>> GetByIdAsync(int id);
        Task<ApiResponse<bool>> UpdateAsync(ComplaintUpdateDto dto);
        Task<ApiResponse<bool >>DeleteAsync(int id, int actionUserId);
        Task<ApiResponse<bool>> UpdateStatusAsync(ComplaintStatusUpdateDto dto);

        Task<ApiResponse<dynamic?>> GetComplaintsAssignedToTechnicianAsync(int employeeId);
    }
}
