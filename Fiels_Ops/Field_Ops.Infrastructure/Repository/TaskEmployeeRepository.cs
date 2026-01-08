using Dapper;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO.TaskEMployeeDto;
using System.Data;

public class TaskEmployeesRepository : ITaskEmployeesRepository
{
    private readonly IDbConnection _db;

    public TaskEmployeesRepository(IDbConnection db)
    {
        _db = db;
    }
    public async Task<int> AssignAsync(TaskEmployeeAssignDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "ASSIGN");
        p.Add("@TaskId", dto.TaskId);
        p.Add("@EmployeeId", dto.EmployeeId);
        p.Add("@Role", dto.Role);
        p.Add("@ActionUserId", dto.ActionUserId);

        return await _db.QueryFirstAsync<int>(
            "SP_TASKEMPLOYEES",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> RemoveAsync(int id, int actionUserId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "REMOVE");
        p.Add("@Id", id);
        p.Add("@ActionUserId", actionUserId);

        return await _db.QueryFirstAsync<int>(
            "SP_TASKEMPLOYEES",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<dynamic>> GetByTaskAsync(int taskId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETBYTASK");
        p.Add("@TaskId", taskId);

        return await _db.QueryAsync<dynamic>(
            "SP_TASKEMPLOYEES",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<dynamic?> GetByIdAsync(int id)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETBYID");
        p.Add("@Id", id);

        return await _db.QueryFirstOrDefaultAsync<dynamic>(
            "SP_TASKEMPLOYEES",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<dynamic>> GetByEmployeeAsync(int employeeId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETBYEMPLOYEE");
        p.Add("@EmployeeId", employeeId);

        return await _db.QueryAsync<dynamic>(
            "SP_TASKEMPLOYEES",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<dynamic>> GetTasksByTechnicianStatusAsync(int employeeId, string? status)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETTASKS_BY_TECHNICIAN_STATUS");
        p.Add("@EmployeeId", employeeId);
        p.Add("@Status", status); 

        return await _db.QueryAsync<dynamic>(
            "SP_TASKEMPLOYEES",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> UpdateAsync(TaskEmployeeUpdateDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "UPDATE");
        p.Add("@Id", dto.Id);
        p.Add("@Role", dto.Role);
        p.Add("@ActionUserId", dto.ActionUserId);

        return await _db.QueryFirstAsync<int>(
            "SP_TASKEMPLOYEES",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

}
