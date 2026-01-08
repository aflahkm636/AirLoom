using Field_Ops.Application.common;
using Field_Ops.Application.DTO.DepartmentDto;


public interface IDepartmentService
{
    Task<ApiResponse<int>> CreateAsync(DepartmentCreateDto dto);
    Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync();
    Task<ApiResponse<dynamic>> GetByIdAsync(int id);
    Task<ApiResponse<bool>> UpdateAsync(DepartmentUpdateDto dto);
    Task<ApiResponse<bool>> DeleteAsync(int id, int deletedBy);
}
