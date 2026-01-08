using Field_Ops.Application.common;
using Field_Ops.Application.DTO.TaskEMployeeDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface ITaskEmployeesService
    {
        Task<ApiResponse<int>> AssignAsync(TaskEmployeeAssignDto dto);
        Task<ApiResponse<bool>> RemoveAsync(int id, int actionUserId);
        Task<ApiResponse<IEnumerable<dynamic>>> GetByTaskAsync(int taskId);
        Task<ApiResponse<dynamic?>> GetByIdAsync(int id);
        Task<ApiResponse<IEnumerable<dynamic>>> GetByEmployeeAsync(int employeeId);
        Task<ApiResponse<IEnumerable<dynamic>>> GetTasksByTechnicianStatusAsync(int employeeId, string? status);
        Task<ApiResponse<int>> UpdateAsync(TaskEmployeeUpdateDto dto);

    }
}
