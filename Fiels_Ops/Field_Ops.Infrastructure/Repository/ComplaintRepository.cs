using Dapper;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO;
using System.Data;

public class ComplaintsRepository : IComplaintsRepository
{
    private readonly IDbConnection _db;

    public ComplaintsRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<int> CreateAsync(ComplaintCreateDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "CREATE");
        p.Add("@CustomerId", dto.CustomerId);
        p.Add("@Description", dto.Description);
        p.Add("@ActionUserId", dto.ActionUserId);

        // SP returns NewComplaintId
        return await _db.QueryFirstAsync<int>(
            "SP_COMPLAINTS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<dynamic>> GetAllAsync()
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETALL");

        return await _db.QueryAsync<dynamic>(
            "SP_COMPLAINTS",
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
            "SP_COMPLAINTS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> UpdateAsync(ComplaintUpdateDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "UPDATE");
        p.Add("@Id", dto.Id);
        p.Add("@Description", dto.Description);
        p.Add("@ActionUserId", dto.ActionUserId);

        return await _db.QueryFirstAsync<int>(
            "SP_COMPLAINTS",
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
            "SP_COMPLAINTS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> UpdateStatusAsync(ComplaintStatusUpdateDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "UPDATESTATUS");
        p.Add("@Id", dto.Id);
        p.Add("@NewStatus", dto.NewStatus.ToString());
        p.Add("@ResolutionNote", dto.ResolutionNote);
        p.Add("@ActionUserId", dto.ActionUserId);

        return await _db.QueryFirstAsync<int>(
            "SP_COMPLAINTS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<dynamic>> GetComplaintsAssignedToTechnicianAsync(int employeeId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GET_COMPLAINTS_ASSIGNED_TO_TECHNICIAN");
        p.Add("@EmployeeId", employeeId);

        return await _db.QueryAsync<dynamic>(
            "SP_COMPLAINTS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }
}
