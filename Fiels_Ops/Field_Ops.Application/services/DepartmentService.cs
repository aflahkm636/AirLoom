using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO.DepartmentDto;

namespace Field_Ops.Application.services
{


    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _repo;

        public DepartmentService(IDepartmentRepository repo)
        {
            _repo = repo;
        }

        public async Task<ApiResponse<int>> CreateAsync(DepartmentCreateDto dto)
        {
            int newId = await _repo.CreateAsync(dto);

            if (newId <= 0)
                return ApiResponse<int>.FailResponse(400, "Failed to create department.");

            return ApiResponse<int>.SuccessResponse(newId, "Department created successfully.");
        }

        public async Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(200, "Departments fetched successfully.", list);
        }

        public async Task<ApiResponse<dynamic>> GetByIdAsync(int id)
        {
            var department = await _repo.GetByIdAsync(id);

            if (department == null)
                return ApiResponse<dynamic>.FailResponse(404, "Department not found.");

            return ApiResponse<dynamic>.SuccessResponse(200, "Department fetched successfully.", department);
        }

        public async Task<ApiResponse<bool>> UpdateAsync(DepartmentUpdateDto dto)
        {
            bool updated = await _repo.UpdateAsync(dto);

            if (!updated)
                return ApiResponse<bool>.FailResponse(400, "Failed to update department.");

            return ApiResponse<bool>.SuccessResponse(200, "Department updated successfully.");
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id, int deletedBy)
        {
            bool deleted = await _repo.DeleteAsync(id, deletedBy);

            if (!deleted)
                return ApiResponse<bool>.FailResponse(400, "Failed to delete department.");

            return ApiResponse<bool>.SuccessResponse(200, "Department deleted successfully.");
        }
    }

}
