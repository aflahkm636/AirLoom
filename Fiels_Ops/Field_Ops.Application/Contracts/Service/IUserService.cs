using Field_Ops.Application.common;
using Field_Ops.Application.DTO.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface IUserService
    {
        Task<ApiResponse<dynamic?>> GetUserByEmailAsync(string email);
        Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync();
        Task<ApiResponse<dynamic?>> GetByIdAsync(int id);
        Task<ApiResponse<bool>> UpdateUserProfileAsync(UserProfileUpdateDto dto);
        Task<ApiResponse<bool>> UpdateUserRoleAsync(UserRoleUpdateDto dto);

        Task<ApiResponse<bool>> DeleteUserAsync(int id, int deletedBy);

        Task<ApiResponse<string?>> GetPasswordHashAsync(int userId);
        Task<ApiResponse<string>> ChangePasswordAsync(ChangePasswordDto dto);

        Task<ApiResponse<string>> SendOtpAsync(ForgotPasswordDto dto);
        Task<ApiResponse<string>> ResetPasswordAsync(ResetPasswordDto dto);
    }
}
