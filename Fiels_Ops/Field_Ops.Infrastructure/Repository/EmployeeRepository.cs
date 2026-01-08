using Dapper;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO.EmployeeDto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Infrastructure.Repository
{
    public class EmployeesRepository : IEmployeesRepository
    {
        private readonly IDbConnection _db;

        public EmployeesRepository(IDbConnection db)
        {
            _db = db;
        }

     
        public async Task<bool> CreateEmployeeAsync(EmployeeCreateDto dto)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "INSERT");

            p.Add("@Name", dto.Name);
            p.Add("@Email", dto.Email);
            p.Add("@Phone", dto.Phone);
            p.Add("@PasswordHash", dto.Password);
            p.Add("@Role", dto.Role.ToString());         
            p.Add("@ProfileImage", dto.ProfileImage);

            p.Add("@Designation", dto.Designation);
            p.Add("@DepartmentId", dto.DepartmentId);
            p.Add("@JoiningDate", dto.JoiningDate);
            p.Add("@Salary", dto.Salary);
            p.Add("@Status", dto.Status);

            p.Add("@CreatedBy", dto.CreatedBy);

            var result = await _db.QueryFirstAsync<dynamic>(
                "SP_EMPLOYEES",
                p,
                commandType: CommandType.StoredProcedure
            );

            return true;
        }


        public async Task<IEnumerable<dynamic>> GetAllAsync()
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "GETALL");

            return await _db.QueryAsync<dynamic>(
                "SP_EMPLOYEES",
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
                "SP_EMPLOYEES",
                p,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<bool> UpdateEmployeeAsync(EmployeeUpdateDto dto)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "UPDATE");
            p.Add("@Id", dto.Id);

            p.Add("@Designation", dto.Designation);
            p.Add("@DepartmentId", dto.DepartmentId);
            p.Add("@Salary", dto.Salary);
            p.Add("@Status", dto.Status);

            p.Add("@ModifiedBy", dto.ModifiedBy);

            try
            {
                await _db.ExecuteAsync(
                    "SP_EMPLOYEES",
                    p,
                    commandType: CommandType.StoredProcedure
                );

                return true;
            }
            catch
            {
                return false;
            }
        }


        public async Task<bool> DeleteEmployeeAsync(int id, int deletedBy)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "DELETE");
            p.Add("@Id", id);
            p.Add("@DeletedBy", deletedBy);

            try
            {
                await _db.ExecuteAsync(
                    "SP_EMPLOYEES",
                    p,
                    commandType: CommandType.StoredProcedure
                );

                return true;
            }
            catch
            {
                return false;
            }
        }


        public async Task<int>GetEmployeeIdByUSerID(int id)
        {
            var sql = @"SELECT Id FROM Employees
                        WHERE UserId=@id
                        AND Status=1
                        AND IsDeleted=0
                          ";

            return await _db.QueryFirstOrDefaultAsync<int>(sql, new { id });
        } 
        public async Task<int>DepartmentIdByUSerID(int id)
        {
            var sql = @"SELECT DepartmentId  FROM Employees
                        WHERE UserId=@id
                        AND Status=1
                        AND IsDeleted=0
                          ";

            return await _db.QueryFirstOrDefaultAsync<int>(sql, new { id });
        } 
    }

    }
