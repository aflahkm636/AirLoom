using Field_Ops.Application.DTO.EmployeeDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface IEmployeesRepository
    {
        Task<bool> CreateEmployeeAsync(EmployeeCreateDto dto);
        Task<IEnumerable<dynamic>> GetAllAsync();
        Task<dynamic?> GetByIdAsync(int id);
        Task<bool> UpdateEmployeeAsync(EmployeeUpdateDto dto);
        Task<bool> DeleteEmployeeAsync(int id, int deletedBy);
        Task<int> DepartmentIdByUSerID(int id);
        Task<int> GetEmployeeIdByUSerID(int id);
    }
}
