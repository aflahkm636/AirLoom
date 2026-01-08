using Field_Ops.Application.common;
using Field_Ops.Application.DTO.EmployeeDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface IEmployeesService
    {
        Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync();
        Task<ApiResponse<dynamic?>> GetByIdAsync(int id);
        Task<ApiResponse<bool>> UpdateEmployeeAsync(EmployeeUpdateDto dto);
        Task<ApiResponse<bool>> DeleteEmployeeAsync(int id, int deletedBy);
    }
}
