using Field_ops.Domain.Enums;
using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO;

public class ServiceTasksService : IServiceTasksService
{
    private readonly IServiceTasksRepository _repo;

    public ServiceTasksService(IServiceTasksRepository repo)
    {
        _repo = repo;
    }

    public async Task<ApiResponse<int>> CreateAsync(ServiceTaskCreateDto dto)
    {
        if (dto.SubscriptionId is null && dto.ComplaintId is null)
            throw new ArgumentException("SubscriptionId or ComplaintId is required.");

        if (dto.SubscriptionId is not null && dto.ComplaintId is not null)
            throw new ArgumentException("Only one of SubscriptionId or ComplaintId can be provided.");

        int newId = await _repo.CreateAsync(dto);

        return ApiResponse<int>.SuccessResponse(
        201,
        "Service task created successfully.",
        newId
    );

    }

    public async Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
            200,
            "Tasks fetched successfully.",
            list
        );
    }

    public async Task<ApiResponse<dynamic?>> GetByIdAsync(int id)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid Id.");

        var data = await _repo.GetByIdAsync(id);

        if (data == null)
            throw new KeyNotFoundException("Service task not found.");

        return ApiResponse<dynamic?>.SuccessResponse(
            200,
            "Task fetched successfully.",
            data
        );
    }

    public async Task<ApiResponse<bool>> UpdateAsync(ServiceTaskUpdateDto dto)
    {
        if (dto.Id <= 0)
            throw new ArgumentException("Task Id required.");

        int response = await _repo.UpdateAsync(dto);

        //if (rows <= 0)
        //    throw new Exception("Failed to update service task.");

        return ApiResponse<bool>.SuccessResponse(
            200,
            "Service task updated successfully."
        );
    }


    public async Task<ApiResponse<bool>> UpdateStatusAsync(ServiceTaskUpdateStatusDto dto)
    {
        if (dto.Id <= 0)
            throw new ArgumentException("Task Id required.");

        int response = await _repo.UpdateStatusAsync(dto);

        //if (rows <= 0)
        //    throw new Exception("Failed to update task status.");

        return ApiResponse<bool>.SuccessResponse(
            200,
            "Task status updated successfully."
        );
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id, int actionUserId)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid Id.");

        int response = await _repo.DeleteAsync(id, actionUserId);

        //if (rows <= 0)
        //    throw new Exception("Failed to delete service task.");

        return ApiResponse<bool>.SuccessResponse(
            200,
            "Service task deleted successfully."
        );
    }


    public async Task<ApiResponse<IEnumerable<dynamic>>> GetTasksByCustomerAsync(int actionUserId)
    {
        if (actionUserId <= 0)
            throw new ArgumentException("Invalid ActionUserId.");

        var data = await _repo.GetTasksByCustomerAsync(actionUserId);

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
            200,
            "Customer tasks fetched successfully.",
            data
        );
    }

    public async Task<ApiResponse<IEnumerable<dynamic>>> GetTasksByStatusAsync(ServiceTaskStatus status)
    {
        var data = await _repo.GetTasksByStatusAsync(status.ToString());

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
            200,
            "Tasks fetched successfully.",
            data
        );
    }

    public async Task<ApiResponse<IEnumerable<dynamic>>> GetTasksByTechnicianAsync(int employeeId)
    {
        if (employeeId <= 0)
            throw new ArgumentException("Invalid EmployeeId.");

        var list = await _repo.GetTasksByTechnicianAsync(employeeId);

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
            200,
            "Technician tasks fetched successfully.",
            list
        );
    }

    public async Task<ApiResponse<IEnumerable<dynamic>>> GetTasksBySubscriptionIdAsync(int subscriptionId)
    {
        if (subscriptionId <= 0)
            throw new ArgumentException("Invalid SubscriptionId.");

        var list = await _repo.GetTasksBySubscriptionIdAsync(subscriptionId);

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
            200,
            "Subscription tasks fetched successfully.",
            list
        );
    }

    public async Task<ApiResponse<IEnumerable<dynamic>>> GetAwaitingApprovalAsync(int actionUserId)
    {
        if (actionUserId <= 0)
            throw new ArgumentException("Invalid ActionUserId.");

        var data = await _repo.GetAwaitingApprovalTasksAsync(actionUserId);

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
            200,
            "Awaiting approval tasks fetched successfully.",
            data
        );
    }

}
