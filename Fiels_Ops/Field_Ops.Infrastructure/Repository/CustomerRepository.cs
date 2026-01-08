using Dapper;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO.CustomerDto;
using System.Data;

namespace Field_Ops.Infrastructure.Repository
{


    public class CustomerRepository : ICustomerRepository
    {
        private readonly IDbConnection _db;

        public CustomerRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<bool> AddCustomerAsync(CustomerRegisterDto dto)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@FLAG", "INSERT");

            parameters.Add("@Name", dto.Name);
            parameters.Add("@Email", dto.Email);
            parameters.Add("@Phone", dto.Phone);
            parameters.Add("@PasswordHash", dto.PasswordHash);
            parameters.Add("@Role", "Customer");
            parameters.Add("@ProfileImage", dto.ProfileImage);

            parameters.Add("@Address", dto.Address);
            parameters.Add("@City", dto.City);
            parameters.Add("@Pincode", dto.Pincode);
            parameters.Add("@Status", true);

            parameters.Add("@CreatedBy", dto.CreatedBy);

            var result = await _db.ExecuteAsync(
          "SP_CUSTOMERS",
          parameters,
          commandType: CommandType.StoredProcedure
      );

            return true;
        }

        public async Task<IEnumerable<CustomerDto>> GetAllAsync()
        {                                                                   
            var parameters = new DynamicParameters();
            parameters.Add("@FLAG", "GETALL");

            return await _db.QueryAsync<CustomerDto>(
                "SP_CUSTOMERS",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<CustomerDto?> GetByIdAsync(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@FLAG", "GETBYID");
            parameters.Add("@Id", id);

            return await _db.QueryFirstOrDefaultAsync<CustomerDto>(
                "SP_CUSTOMERS",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<CustomerDto?> GetByUserIdAsync(int userId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@FLAG", "GETBYUSERID");
            parameters.Add("@UserId", userId);

            return await _db.QueryFirstOrDefaultAsync<CustomerDto>(
                "SP_CUSTOMERS",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> GetCustomerIdByUserId(int userId)
        {
            var sql = @"SELECT Id 
                FROM Customers 
                WHERE UserId = @userId 
                  AND Status = 1
                  AND IsDeleted = 0";

            return await _db.QueryFirstOrDefaultAsync<int>(sql, new { userId });
        }
    }

    }
