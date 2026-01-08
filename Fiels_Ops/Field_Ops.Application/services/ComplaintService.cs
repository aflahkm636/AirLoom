using Field_ops.Domain.Enums;
using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO;
using Field_Ops.Application.Exceptions;

public class ComplaintsService : IComplaintsService
{
    private readonly IComplaintsRepository _repo;

    public ComplaintsService(IComplaintsRepository repo)
    {
        _repo = repo;
    }

    public async Task<ApiResponse<int>> CreateAsync(ComplaintCreateDto dto)
    {
        var id = await _repo.CreateAsync(dto);

        if (id <= 0)
            throw new ValidationException("Failed to create complaint.");

        return ApiResponse<int>.SuccessResponse(200, "Complaint created.", id);
    }

    public async Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync()
    {
        var data = await _repo.GetAllAsync();

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
            200,
            "Complaints fetched.",
            data
        );
    }

    public async Task<ApiResponse<dynamic?>> GetByIdAsync(int id)
    {
        var data = await _repo.GetByIdAsync(id);

        if (data == null)
            throw new NotFoundException("Complaint not found.");

        return ApiResponse<dynamic?>.SuccessResponse(
            200,
            "Complaint fetched.",
            data
        );
    }

    public async Task<ApiResponse<bool>> UpdateAsync(ComplaintUpdateDto dto)
    {
        var rows = await _repo.UpdateAsync(dto);

        if (rows == 0)
            throw new NotFoundException("Complaint not found.");

        return ApiResponse<bool>.SuccessResponse(200, "Complaint updated.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id, int actionUserId)
    {
        var rows = await _repo.DeleteAsync(id, actionUserId);

        if (rows == 0)
            throw new NotFoundException("Complaint not found.");

        return ApiResponse<bool>.SuccessResponse(200, "Complaint deleted.");
    }

    public async Task<ApiResponse<bool>> UpdateStatusAsync(ComplaintStatusUpdateDto dto)
    {
        var rows = await _repo.UpdateStatusAsync(dto);

        if (rows == 0)
            throw new NotFoundException("Complaint not found.");

        return ApiResponse<bool>.SuccessResponse(200, "Status updated.");
    }

    public async Task<ApiResponse<dynamic?>> GetComplaintsAssignedToTechnicianAsync(int employeeId)
    {
        var data = await _repo.GetComplaintsAssignedToTechnicianAsync(employeeId);

        if (data == null)
            throw new NotFoundException("Complaint not found.");

        return ApiResponse<dynamic?>.SuccessResponse(
            200,
            "Complaints fetched.",
            data
        );
    }
}
