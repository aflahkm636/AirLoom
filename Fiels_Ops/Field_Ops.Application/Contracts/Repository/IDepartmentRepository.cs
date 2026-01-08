using Field_Ops.Application.DTO.DepartmentDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface IDepartmentRepository
    {
        Task<int> CreateAsync(DepartmentCreateDto dto);
        Task<IEnumerable<dynamic>> GetAllAsync();
        Task<dynamic?> GetByIdAsync(int id);
        Task<bool> UpdateAsync(DepartmentUpdateDto dto);
        Task<bool> DeleteAsync(int id, int deletedBy);
    }

}
