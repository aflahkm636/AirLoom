using Field_Ops.Application.DTO.MaterialUsageDto;
using Field_Ops.Application.common;

public interface IMaterialUsageService
{
    Task<ApiResponse<int>> CreateAsync(MaterialUsageCreateDto dto, int actionUserId);
    Task<ApiResponse<bool>> DeleteAsync(int id, int actionUserId);
    Task<ApiResponse<dynamic?>> GetByIdAsync(int id);
    Task<ApiResponse<IEnumerable<dynamic?>>> GetByTaskAsync(int taskId);
}
