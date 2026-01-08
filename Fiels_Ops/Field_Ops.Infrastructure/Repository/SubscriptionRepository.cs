using Dapper;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO.SubscriptionDto;
using System.Data;

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly IDbConnection _db;

    public SubscriptionRepository(IDbConnection db)
    {
        _db = db;
    }

    public Task<int> CreateAsync(SubscriptionCreateDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "CREATE");
        p.Add("@CustomerId", dto.CustomerId);
        p.Add("@PlanId", dto.PlanId);
        p.Add("@MachineProductId", dto.MachineProductId);
        p.Add("@StartDate", dto.StartDate);
        p.Add("@CreatedBy", dto.CreatedBy);

        return _db.QueryFirstAsync<int>(
            "SP_SUBSCRIPTIONS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<IEnumerable<dynamic>> GetAllAsync()
    {
        return _db.QueryAsync<dynamic>(
            "SP_SUBSCRIPTIONS",
            new { FLAG = "GETALL" },
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<dynamic?> GetByIdAsync(int id)
    {
        return _db.QueryFirstOrDefaultAsync<dynamic>(
            "SP_SUBSCRIPTIONS",
            new { FLAG = "GETBYID", Id = id },
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<IEnumerable<dynamic>> GetByCustomerIdAsync(int customerId)
    {
        return _db.QueryAsync<dynamic>(
            "SP_SUBSCRIPTIONS",
            new { FLAG = "GETBYCUSTOMER", CustomerId = customerId },
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<int> UpdateAsync(SubscriptionUpdateDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "UPDATE");
        p.Add("@Id", dto.Id);
        p.Add("@PlanId", dto.PlanId);
        p.Add("@MachineProductId", dto.MachineProductId);
        p.Add("@ModifiedBy", dto.ModifiedBy);

        return _db.QueryFirstAsync<int>(
            "SP_SUBSCRIPTIONS",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<int> PauseAsync(int id, int modifiedBy)
    {
        return _db.QueryFirstAsync<int>(
            "SP_SUBSCRIPTIONS",
            new
            {
                FLAG = "PAUSE",
                Id = id,
                ModifiedBy = modifiedBy
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<int> ResumeAsync(int id, int modifiedBy)
    {
        return _db.QueryFirstAsync<int>(
            "SP_SUBSCRIPTIONS",
            new
            {
                FLAG = "RESUME",
                Id = id,
                ModifiedBy = modifiedBy
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<int> CancelAsync(int id, int modifiedBy, DateTime cancelledOn)
    {
        return _db.QueryFirstAsync<int>(
            "SP_SUBSCRIPTIONS",
            new
            {
                FLAG = "CANCEL",
                Id = id,
                CancelledOn = cancelledOn,
                ModifiedBy = modifiedBy
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<int> DeleteAsync(int id, int deletedBy)
    {
        return _db.QueryFirstAsync<int>(
            "SP_SUBSCRIPTIONS",
            new
            {
                FLAG = "DELETE",
                Id = id,
                DeletedBy = deletedBy
            },
            commandType: CommandType.StoredProcedure
        );
    }
}
