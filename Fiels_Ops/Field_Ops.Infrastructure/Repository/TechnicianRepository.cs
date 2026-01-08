using Dapper;
using Field_Ops.Application.Contracts.Repository;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Field_Ops.Infrastructure.Repository
{
    public class TechniciansRepository : ITechniciansRepository
    {
        private readonly IDbConnection _db;

        public TechniciansRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<IEnumerable<dynamic>> GetAllAsync()
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "GETALL");

            return await _db.QueryAsync<dynamic>(
                "SP_TECHNICIANS",
                p,
                commandType: CommandType.StoredProcedure
            );
        }

   
        public async Task<IEnumerable<dynamic>> GetActiveAsync()
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "GETACTIVE");

            return await _db.QueryAsync<dynamic>(
                "SP_TECHNICIANS",
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
                "SP_TECHNICIANS",
                p,
                commandType: CommandType.StoredProcedure
            );
        }
    }
}
