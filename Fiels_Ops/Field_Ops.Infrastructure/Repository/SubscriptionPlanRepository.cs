using Dapper;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO.SubscriptionPlanDto;
using System.Data;

namespace Field_Ops.Infrastructure.Repository
{
    public class SubscriptionPlanRepository : ISubscriptionPlanRepository
    {
        private readonly IDbConnection _db;

        public SubscriptionPlanRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<int> CreateAsync(SubscriptionPlanCreateDto dto)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "CREATE");
            p.Add("@Name", dto.Name);
            p.Add("@Description", dto.Description);
            p.Add("@ServiceFrequencyInDays", dto.ServiceFrequencyInDays);
            p.Add("@BillingCycleInMonths", dto.BillingCycleInMonths);
            p.Add("@PricePerCycle", dto.PricePerCycle);
            p.Add("@IsActive", dto.IsActive);
            p.Add("@CreatedBy", dto.CreatedBy);

            return await _db.QuerySingleAsync<int>(
                "SP_SUBSCRIPTIONPLANS",
                p,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<dynamic>> GetAllAsync()
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "GETALL");

            return await _db.QueryAsync(
                "SP_SUBSCRIPTIONPLANS",
                p,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<dynamic?> GetByIdAsync(int id)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "GETBYID");
            p.Add("@Id", id);

            return await _db.QueryFirstOrDefaultAsync(
                "SP_SUBSCRIPTIONPLANS",
                p,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<bool> UpdateAsync(SubscriptionPlanUpdateDto dto)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "UPDATE");
            p.Add("@Id", dto.Id);
            p.Add("@Description", dto.Description);
            p.Add("@ServiceFrequencyInDays", dto.ServiceFrequencyInDays);
            p.Add("@BillingCycleInMonths", dto.BillingCycleInMonths);
            p.Add("@PricePerCycle", dto.PricePerCycle);
            p.Add("@IsActive", dto.IsActive);
            p.Add("@ModifiedBy", dto.ModifiedBy);

            var rows = await _db.ExecuteAsync(
                "SP_SUBSCRIPTIONPLANS",
                p,
                commandType: CommandType.StoredProcedure
            );

            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int id, int deletedBy)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "DELETE");
            p.Add("@Id", id);
            p.Add("@DeletedBy", deletedBy);

            var rows = await _db.ExecuteAsync(
                "SP_SUBSCRIPTIONPLANS",
                p,
                commandType: CommandType.StoredProcedure
            );

            return rows > 0;
        }
    }
}
