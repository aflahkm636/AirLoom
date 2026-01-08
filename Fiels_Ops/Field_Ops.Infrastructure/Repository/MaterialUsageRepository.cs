using Dapper;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO.MaterialUsageDto;
using System.Data;

namespace Field_Ops.Infrastructure.Repository
{
    public class MaterialUsageRepository : IMaterialUsageRepository
    {
        private readonly IDbConnection _db;

        public MaterialUsageRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<int> CreateAsync(MaterialUsageCreateDto dto, int actionUserId)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "CREATE");
            p.Add("@TaskId", dto.TaskId);
            p.Add("@ProductId", dto.ProductId);
            p.Add("@QuantityUsed", dto.QuantityUsed);
            p.Add("@UsageType", dto.UsageType);
            p.Add("@ActionUserId", actionUserId);

            return await _db.ExecuteScalarAsync<int>(
                "SP_MATERIALUSAGE",
                p,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<bool> DeleteAsync(int id, int actionUserId)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "DELETE");
            p.Add("@Id", id);
            p.Add("@ActionUserId", actionUserId);

            await _db.ExecuteAsync(
                "SP_MATERIALUSAGE",
                p,
                commandType: CommandType.StoredProcedure
            );

            return true;
        }

        public async Task<dynamic?> GetByIdAsync(int id)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "GETBYID");
            p.Add("@Id", id);

            return await _db.QueryFirstOrDefaultAsync<dynamic>(
                "SP_MATERIALUSAGE",
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
                "SP_MATERIALUSAGE",
                p,
                commandType: CommandType.StoredProcedure
            );
        }
    }
}
