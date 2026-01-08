using Field_Ops.Application.DTO.TaskEMployeeDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
   

    public interface ITaskEmployeesRepository
    {
        Task<int> AssignAsync(TaskEmployeeAssignDto dto);
        Task<int> RemoveAsync(int id, int actionUserId);
        Task<IEnumerable<dynamic>> GetByTaskAsync(int taskId);
        Task<dynamic?> GetByIdAsync(int id);
        Task<IEnumerable<dynamic>> GetByEmployeeAsync(int employeeId);
        Task<IEnumerable<dynamic>> GetTasksByTechnicianStatusAsync(int employeeId, string? status);

        Task<int> UpdateAsync(TaskEmployeeUpdateDto dto);
    }

}
