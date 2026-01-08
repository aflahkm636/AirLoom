using Dapper;
using Field_Ops.Application.Contracts.Repository;
using System.Data;

public class AutomationRepository : IAutomationRepository
{
    private readonly IDbConnection _db;

    public AutomationRepository(IDbConnection db)
    {
        _db = db;
    }

    // ---------------- SERVICE DUE ----------------

    public async Task<IEnumerable<dynamic>> GetSubscriptionsDueForServiceAsync()
    {
        var sql = @"
        SELECT Id
        FROM Subscriptions
        WHERE IsDeleted = 0
          AND Status = 'Active'
          AND NextServiceDate IS NOT NULL
          AND NextServiceDate <= CAST(SYSUTCDATETIME() AS DATE)";

        return await _db.QueryAsync<dynamic>(sql);
    }

    // ---------------- BILLING ----------------

    public async Task<IEnumerable<dynamic>> GetSubscriptionsForBillingAsync(DateTime billMonth)
    {
        var sql = @"
        SELECT Id
        FROM Subscriptions
        WHERE IsDeleted = 0
          AND Status = 'Active'
          AND StartDate <= EOMONTH(@BillMonth)
          AND (CancelledOn IS NULL OR CancelledOn >= @BillMonth)";

        return await _db.QueryAsync<dynamic>(sql, new { BillMonth = billMonth });
    }


    //public async Task<bool> MarkServiceDueAsync(int id, int modifiedBy)
    //{
    //    var p = new DynamicParameters();
    //    p.Add("@FLAG", "AUTOSERVICE_DUE");
    //    p.Add("@Id", id);
    //    p.Add("@ModifiedBy", modifiedBy);

    //    await _db.ExecuteAsync("SP_SUBSCRIPTIONS", p, commandType: CommandType.StoredProcedure);
    //    return true;
    //}

    public async Task<bool> AutoCreateServiceTaskAsync(int subscriptionId, string? notes)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "AUTO_CREATE");
        p.Add("@SubscriptionId", subscriptionId);
        p.Add("@Notes", notes);

        await _db.ExecuteAsync("SP_SERVICETASKS", p, commandType: CommandType.StoredProcedure);
        return true;
    }
}
