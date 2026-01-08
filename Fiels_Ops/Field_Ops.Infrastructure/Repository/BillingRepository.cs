using Dapper;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO.BIllingDto;
using System.Data;

public class BillingRepository : IBillingRepository
{
    private readonly IDbConnection _db;

    public BillingRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task GenerateAsync(int subscriptionId, DateTime billMonth, int systemUserId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GENERATE");
        p.Add("@SubscriptionId", subscriptionId);
        p.Add("@BillMonth", new DateTime(billMonth.Year, billMonth.Month, 1));
        p.Add("@ActionUserId", systemUserId);

        await _db.ExecuteAsync(
            "SP_BILLING_V2",
            p,
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<IEnumerable<dynamic>> GetPendingAsync()
    {
        return _db.QueryAsync<dynamic>(
            "SP_BILLING_V2",
            new { FLAG = "GETPENDING" },
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<dynamic?> GetByIdAsync(int id)
    {
        return _db.QueryFirstOrDefaultAsync<dynamic>(
            "SP_BILLING_V2",
            new { FLAG = "GETBYID", Id = id },
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<IEnumerable<dynamic>> GetByCustomerAsync(int customerId)
    {
        return _db.QueryAsync<dynamic>(
            "SP_BILLING_V2",
            new { FLAG = "GETBYCUSTOMER", CustomerId = customerId },
            commandType: CommandType.StoredProcedure
        );
    }

    public Task<BillingDto> UpdateDiscountAsync(BillingDiscountUpdateDto dto)
    {
        return _db.QuerySingleAsync<BillingDto>(
            "SP_BILLING_V2",
            new
            {
                FLAG = "UPDATE_DISCOUNT",
                Id = dto.BillingId,
                 dto.DiscountPercent,
               dto.ActionUserId
            },
            commandType: CommandType.StoredProcedure
        );
    }


    public Task<BillingDto> FinalizeAsync(int billingId, int adminUserId)
    {
        return _db.QuerySingleAsync<BillingDto>(
            "SP_BILLING_V2",
            new
            {
                FLAG = "FINALIZE",
                Id = billingId,
                ActionUserId = adminUserId
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<bool> RegenerateAsync(int billId, int actionUserId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "REGENERATE");
        p.Add("@Id", billId);
        p.Add("@ActionUserId", actionUserId);

        await _db.ExecuteAsync(
            "SP_BILLING_V2",
            p,
            commandType: CommandType.StoredProcedure
        );

        return true;
    }
    public async Task<InvoicePdfDto?> GetInvoiceDataAsync(int billId)
    {
        return await _db.QuerySingleOrDefaultAsync<InvoicePdfDto>(
            "SP_BILLING_GET_INVOICE",
            new { BillingId = billId },
            commandType: CommandType.StoredProcedure
        );
    }

}
