using Dapper;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO;
using System.Data;

public class ServiceTasksRepository : IServiceTasksRepository
{
    private readonly IDbConnection _db;

    public ServiceTasksRepository(IDbConnection db)
    {
        _db = db;
    }

   
    public async Task<int> CreateAsync(ServiceTaskCreateDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "CREATE");
        p.Add("@SubscriptionId", dto.SubscriptionId);
        p.Add("@ComplaintId", dto.ComplaintId);

        if (dto.TaskDate.HasValue)
            p.Add("@TaskDate", dto.TaskDate);

        p.Add("@Notes", dto.Notes);
        p.Add("@ActionUserId", dto.ActionUserId);

        return await _db.QueryFirstAsync<int>(
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    // ----------------------------------------------------
    // AUTO CREATE (Scheduler / background job)
    // ----------------------------------------------------
    public async Task<int> AutoCreateNextTaskAsync(int subscriptionId, int? actionUserId = null)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "AUTO_CREATE");
        p.Add("@SubscriptionId", subscriptionId);
        p.Add("@ActionUserId", actionUserId);

        return await _db.QueryFirstAsync<int>(
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }


    public async Task<IEnumerable<dynamic>> GetAllAsync()
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETALL");

        return await _db.QueryAsync<dynamic>(
            "SP_SERVICETASKS",
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
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }


    public async Task<int> UpdateStatusAsync(ServiceTaskUpdateStatusDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "UPDATESTATUS");
        p.Add("@Id", dto.Id);
        p.Add("@Status", dto.Status.ToString());
        p.Add("@Notes", dto.Notes);
        p.Add("@EmployeeId", dto.EmployeeId);
        p.Add("@ActionUserId", dto.ActionUserId);

        return await _db.QueryFirstAsync<int>(
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }


    public async Task<int> UpdateAsync(ServiceTaskUpdateDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "UPDATE");
        p.Add("@Id", dto.Id);

        if (dto.TaskDate.HasValue)
            p.Add("@TaskDate", dto.TaskDate);

        p.Add("@Notes", dto.Notes);
        p.Add("@RequiresMaterialUsage", dto.RequiresMaterialUsage);
        p.Add("@ActionUserId", dto.ActionUserId);

        return await _db.QueryFirstAsync<int>(
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }


    public async Task<int> DeleteAsync(int id, int actionUserId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "DELETE");
        p.Add("@Id", id);
        p.Add("@ActionUserId", actionUserId);

        return await _db.QueryFirstAsync<int>(
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }


    public async Task<IEnumerable<dynamic>> GetTasksByCustomerAsync(int actionUserId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETTASKS_BY_CUSTOMERID");
        p.Add("@ActionUserId", actionUserId);

        return await _db.QueryAsync<dynamic>(
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }


    public async Task<IEnumerable<dynamic>> GetTasksByStatusAsync(string status)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETTASKS_BY_STATUS");
        p.Add("@Status", status);

        return await _db.QueryAsync<dynamic>(
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }


    public async Task<IEnumerable<dynamic>> GetTasksByTechnicianAsync(int employeeId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETTASKS_BY_TECHNICIAN");
        p.Add("@EmployeeId", employeeId);

        return await _db.QueryAsync<dynamic>(
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }


    public async Task<IEnumerable<dynamic>> GetTasksBySubscriptionIdAsync(int subscriptionId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETTASKS_BY_SUBSCRIPTIONID");
        p.Add("@SubscriptionId", subscriptionId);

        return await _db.QueryAsync<dynamic>(
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }


    public async Task<IEnumerable<dynamic>> GetAwaitingApprovalTasksAsync(int actionUserId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GET_AWAITING_APPROVAL");
        p.Add("@ActionUserId", actionUserId);

        return await _db.QueryAsync<dynamic>(
            "SP_SERVICETASKS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }
}
