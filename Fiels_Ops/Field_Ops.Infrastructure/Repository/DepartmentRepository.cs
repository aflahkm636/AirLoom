using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Field_Ops.Application.Contracts.Repository;
using System.Data;
using Field_Ops.Application.DTO.DepartmentDto;


namespace Field_Ops.Infrastructure.Repository
{
    
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly IDbConnection _db;

        public DepartmentRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<int> CreateAsync(DepartmentCreateDto dto)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "INSERT");
            p.Add("@Name", dto.Name);
            p.Add("@Description", dto.Description);
            p.Add("@Status", dto.Status);
            p.Add("@CreatedBy", dto.CreatedBy);

            return await _db.QueryFirstOrDefaultAsync<int>(
                "SP_DEPARTMENTS",
                p,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<dynamic>> GetAllAsync()
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "GETALL");

            return await _db.QueryAsync<dynamic>(
                "SP_DEPARTMENTS",
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
                "SP_DEPARTMENTS",
                p,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<bool> UpdateAsync(DepartmentUpdateDto dto)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "UPDATE");
            p.Add("@Id", dto.Id);
            p.Add("@Name", dto.Name);
            p.Add("@Description", dto.Description);
            p.Add("@Status", dto.Status);
            p.Add("@ModifiedBy", dto.ModifiedBy);

            await _db.ExecuteAsync(
                "SP_DEPARTMENTS",
                p,
                commandType: CommandType.StoredProcedure
            );

            return true; 
        }

        public async Task<bool> DeleteAsync(int id, int deletedBy)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "DELETE");
            p.Add("@Id", id);
            p.Add("@DeletedBy", deletedBy);

            await _db.ExecuteAsync(
                "SP_DEPARTMENTS",
                p,
                commandType: CommandType.StoredProcedure
            );

            return true;
        }
    }

}
