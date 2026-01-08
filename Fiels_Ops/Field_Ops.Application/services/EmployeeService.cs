using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.EmployeeDto;
using Field_Ops.Application.Helper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Field_Ops.Application.Service
{
    public class EmployeesService : IEmployeesService
    {
        private readonly IEmployeesRepository _repo;

        public EmployeesService(IEmployeesRepository repo )
        {
            _repo = repo;
        }

     
      

        public async Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync()
        {
            var Employees = await _repo.GetAllAsync();

            return ApiResponse<IEnumerable<dynamic>>
                .SuccessResponse(200, "Employees fetched successfully", Employees);
        }

     
        public async Task<ApiResponse<dynamic?>> GetByIdAsync(int id)
        {
            if (id <= 0)
                return ApiResponse<dynamic?>
                    .FailResponse(400,"Invalid Employee ID");

            var emp = await _repo.GetByIdAsync(id);

            return emp != null
                ? ApiResponse<dynamic?>.SuccessResponse(200, "Employee fetched successfully", emp)
                : ApiResponse<dynamic?>.FailResponse(404,"Employee not found");
        }

        public async Task<ApiResponse<bool>> UpdateEmployeeAsync(EmployeeUpdateDto dto)
        {
            if (dto.Id <= 0)
                return ApiResponse<bool>.FailResponse(400,"Invalid Employee ID");

            if (dto.ModifiedBy <= 0)
                return ApiResponse<bool>.FailResponse(400,"ModifiedBy is required");

            var ok = await _repo.UpdateEmployeeAsync(dto);

            return ok
                ? ApiResponse<bool>.SuccessResponse(200, "Employee updated successfully", true)
                : ApiResponse<bool>.FailResponse(400,"Failed to update employee");
        }

  
        public async Task<ApiResponse<bool>> DeleteEmployeeAsync(int id, int deletedBy)
        {
            if (id <= 0)
                return ApiResponse<bool>.FailResponse(400,"Invalid Employee ID");

            if (deletedBy <= 0)
                return ApiResponse<bool>.FailResponse(400,"DeletedBy is required");

            var ok = await _repo.DeleteEmployeeAsync(id, deletedBy);

            return ok
                ? ApiResponse<bool>.SuccessResponse(200, "Employee deleted successfully", true)
                : ApiResponse<bool>.FailResponse(400,"Failed to delete employee");
        }
    }
}
    

