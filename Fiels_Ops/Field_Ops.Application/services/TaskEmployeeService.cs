using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.TaskEMployeeDto;

public class TaskEmployeesService : ITaskEmployeesService
{
    private readonly ITaskEmployeesRepository _repo;

    public TaskEmployeesService(ITaskEmployeesRepository repo)
    {
        _repo = repo;
    }

    public async Task<ApiResponse<int>> AssignAsync(TaskEmployeeAssignDto dto)
    {
        if (dto.TaskId <= 0) throw new ArgumentException("Invalid TaskId.");
        if (dto.EmployeeId <= 0) throw new ArgumentException("Invalid EmployeeId.");
        if (dto.ActionUserId <= 0) throw new ArgumentException("Invalid ActionUserId.");

        int newId = await _repo.AssignAsync(dto);

        return ApiResponse<int>.SuccessResponse(
            200,
            "Technician assigned successfully."
        );
    }

    public async Task<ApiResponse<bool>> RemoveAsync(int id, int actionUserId)
    {
        if (id <= 0) throw new ArgumentException("Invalid Id.");
        if (actionUserId <= 0) throw new ArgumentException("Invalid ActionUserId.");

        int result = await _repo.RemoveAsync(id, actionUserId);

        return ApiResponse<bool>.SuccessResponse(
            200,
            "Technician removed successfully."
        );
    }

    public async Task<ApiResponse<IEnumerable<dynamic>>> GetByTaskAsync(int taskId)
    {
        if (taskId <= 0) throw new ArgumentException("Invalid TaskId.");

        var list = await _repo.GetByTaskAsync(taskId);

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
            200,
            "Task assignments fetched successfully.",
            list
        );
    }

    public async Task<ApiResponse<dynamic?>> GetByIdAsync(int id)
    {
        if (id <= 0) throw new ArgumentException("Invalid Id.");

        var data = await _repo.GetByIdAsync(id);

        if (data == null)
            throw new KeyNotFoundException("Assignment not found.");

        return ApiResponse<dynamic?>.SuccessResponse(
            200,
            "Assignment fetched successfully.",
            data
        );
    }

    public async Task<ApiResponse<IEnumerable<dynamic>>> GetByEmployeeAsync(int employeeId)
    {
        if (employeeId <= 0) throw new ArgumentException("Invalid EmployeeId.");

        var list = await _repo.GetByEmployeeAsync(employeeId);
        if(list == null)
        {
            return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
                        404,
                        "not found."
                        
                    );
        }

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
            200,
            "Employee task assignments fetched successfully.",
            list
        );
    }

    public async Task<ApiResponse<IEnumerable<dynamic>>> GetTasksByTechnicianStatusAsync(int employeeId, string? status)
    {
        if (employeeId <= 0) throw new ArgumentException("Invalid EmployeeId.");

        var list = await _repo.GetTasksByTechnicianStatusAsync(employeeId, status);
        if (list == null)
        {
            return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
                        404,
                        "not found."

                    );
        }
        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(
            200,
            "Technician tasks fetched successfully.",
            list
        );
    }

    public async Task<ApiResponse<int>> UpdateAsync(TaskEmployeeUpdateDto dto)
    {
        if (dto.Id <= 0)
            throw new ArgumentException("Id is required.");

        if (string.IsNullOrWhiteSpace(dto.Role))
            throw new ArgumentException("Role is required.");

        int updatedId = await _repo.UpdateAsync(dto);

        return ApiResponse<int>.SuccessResponse(
            200,
            "Task employee updated successfully.",
            updatedId
        );
    }

}
