using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO.MaterialUsageDto;

public class MaterialUsageService : IMaterialUsageService
{
    private readonly IMaterialUsageRepository _repo;

    public MaterialUsageService(IMaterialUsageRepository repo)
    {
        _repo = repo;
    }

    public async Task<ApiResponse<int>> CreateAsync( MaterialUsageCreateDto dto,int actionUserId)
    {
        if (dto.TaskId <= 0 || dto.ProductId <= 0 || dto.QuantityUsed <= 0)
            return ApiResponse<int>.FailResponse(400, "Invalid material usage data.");

        int newId = await _repo.CreateAsync(dto, actionUserId);

        if (newId <= 0)
            return ApiResponse<int>.FailResponse(400, "Failed to add material usage.");

        return ApiResponse<int>.SuccessResponse(
            200,
            "Material usage added successfully."
        );
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id, int actionUserId)
    {
        if (id <= 0)
            return ApiResponse<bool>.FailResponse(400, "Invalid material usage id.");

        await _repo.DeleteAsync(id, actionUserId);

        return ApiResponse<bool>.SuccessResponse(
            200,
            "Material usage deleted successfully."
        );
    }

    public async Task<ApiResponse<dynamic?>> GetByIdAsync(int id)
    {
        var data = await _repo.GetByIdAsync(id);

        if (data == null)
            return ApiResponse<dynamic?>.FailResponse(404, "Material usage not found.");

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
                200,
                "Success",
                data
            );
    }

    public async Task<ApiResponse<IEnumerable<dynamic?>>> GetByTaskAsync(int taskId)
    {
        var data = await _repo.GetByTaskAsync(taskId);

        return ApiResponse<IEnumerable<dynamic?>>.SuccessResponse(
                200,
                "Success",
                data
            );
    }
}
