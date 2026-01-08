using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using Field_Ops.Application.DTO.UserDto;
using Field_Ops.Application.Contracts.Repository;

namespace Field_Ops.Infrastructure.Repository
{
    public class UsersRepository : IUsersRepository
    {
        private readonly IDbConnection _db;

        public UsersRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<int> RegisterUserAsync(UserRegisterDto dto)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "INSERT");
            p.Add("@Name", dto.Name);
            p.Add("@Email", dto.Email);
            p.Add("@Phone", dto.Phone);
            p.Add("@PasswordHash", dto.PasswordHash);
            p.Add("@Role", dto.Role);
            p.Add("@Status", true);
            p.Add("@ProfileImage", null);
            p.Add("@CreatedBy", dto.CreatedBy);

            return await _db.ExecuteScalarAsync<int>(
                "SP_USERS",
                p,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<dynamic?> GetUserByEmailAsync(string email)
        {
            var sql = @"
                SELECT u.*, e.DepartmentId, c.Id as CustomerId 
                FROM Users u
                LEFT JOIN Employees e ON u.Id = e.UserId
                LEFT JOIN Customers c ON u.Id = c.UserId
                WHERE u.Email = @Email AND u.IsDeleted = 0";

            return await _db.QueryFirstOrDefaultAsync<dynamic>(sql, new { Email = email });
        }

        public async Task<IEnumerable<dynamic>> GetAllAsync()
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "GETALL");

            return await _db.QueryAsync<dynamic>(
                "SP_USERS",
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
                "SP_USERS",
                p,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<bool> UpdateProfileAsync(UserProfileUpdateDto dto)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "UPDATE_PROFILE");
            p.Add("@Id", dto.Id);
            p.Add("@Name", dto.Name);
            p.Add("@Phone", dto.Phone);
            p.Add("@ProfileImage", dto.ProfileImage);
            p.Add("@ModifiedBy", dto.ModifiedBy);

            try
            {
                await _db.ExecuteAsync("SP_USERS", p, commandType: CommandType.StoredProcedure);
                return true;
            }
            catch
            {
                return false;
            }
        }

      
        public async Task<bool> UpdateRoleAsync(UserRoleUpdateDto dto)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "UPDATE_ROLE");
            p.Add("@Id", dto.Id);
            p.Add("@Role", dto.Role.ToString()); // Convert enum to string name for SP
            p.Add("@ModifiedBy", dto.ModifiedBy);

            try
            {
                await _db.ExecuteAsync("SP_USERS", p, commandType: CommandType.StoredProcedure);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteUserAsync(int id, int deletedBy)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "DELETE");
            p.Add("@Id", id);
            p.Add("@DeletedBy", deletedBy);

            try
            {
                await _db.ExecuteAsync(
                    "SP_USERS",
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


        public async Task<string?> GetPasswordHashAsync(int userId)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "GET_HASHED_PASSWORD");
            p.Add("@UserId", userId);

            return await _db.QueryFirstOrDefaultAsync<string>(
                "USP_PASSWORD",
                p,
                commandType: CommandType.StoredProcedure
            );
        }
        public async Task<bool> ChangePasswordAsync(int userId, string newHash, int modifiedBy)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "CHANGE_PASSWORD");
            p.Add("@UserId", userId);
            p.Add("@NewPasswordHash", newHash);
            p.Add("@ModifiedBy", modifiedBy);

            try
            {
                var rows = await _db.ExecuteScalarAsync<int>(
                    "USP_PASSWORD",
                    p,
                    commandType: CommandType.StoredProcedure
                );
                return rows > 0;
            }
            catch
            {
                return false;
            }
        }




        public async Task<bool> SaveResetOtpAsync(string email, string otp, DateTime expiry)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "SET_RESET_OTP");
            p.Add("@Email", email);
            p.Add("@ResetOtp", otp);
            p.Add("@OtpExpiry", expiry);

            try
            {
                var rows = await _db.ExecuteScalarAsync<int>(
                    "USP_PASSWORD",
                    p,
                    commandType: CommandType.StoredProcedure
                );
                return rows > 0;
            }
            catch
            {
                return false;
            }
        }



        public async Task<(string?, DateTime?)> GetResetOtpAsync(string email)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "GET_RESET_OTP");
            p.Add("@Email", email);

            return await _db.QueryFirstOrDefaultAsync<(string?, DateTime?)>(
                "USP_PASSWORD",
                p,
                commandType: CommandType.StoredProcedure
            );
        }



        public async Task<bool> ResetPasswordAsync(string email, string newHash)
        {
            var p = new DynamicParameters();
            p.Add("@FLAG", "RESET_PASSWORD");
            p.Add("@Email", email);
            p.Add("@NewPasswordHash", newHash);

            try
            {
                var rows = await _db.ExecuteScalarAsync<int>(
                    "USP_PASSWORD",
                    p,
                    commandType: CommandType.StoredProcedure
                );
                return rows > 0;
            }
            catch
            {
                return false;
            }
        
    }
    }
}
