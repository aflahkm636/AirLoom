using Field_Ops.Application.DTO.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface IUsersRepository
    {
        Task<int> RegisterUserAsync(UserRegisterDto dto);
        Task<dynamic?> GetUserByEmailAsync(string email);
        Task<dynamic?> GetByIdAsync(int id);
        Task<IEnumerable<dynamic>> GetAllAsync();

        Task<bool> ResetPasswordAsync(string email, string newHash);
        Task<(string? Otp, DateTime? Expiry)> GetResetOtpAsync(string email);
        Task<bool> SaveResetOtpAsync(string email, string otp, DateTime expiry);
        Task<bool> ChangePasswordAsync(int userId, string newHash, int modifiedBy);
        Task<string?> GetPasswordHashAsync(int userId);
        Task<bool> UpdateRoleAsync(UserRoleUpdateDto dto);
        Task<bool> UpdateProfileAsync(UserProfileUpdateDto dto);
        Task<bool> DeleteUserAsync(int id, int deletedBy);
    }
}
