using BCrypt.Net;
using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.UserDto;

namespace Field_Ops.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUsersRepository _repo;
        private readonly IEmailService _emailService;
        private readonly ICloudinaryService _cloudinaryService;

        public UserService(IUsersRepository repo, IEmailService emailService, ICloudinaryService cloudinaryService)
        {
            _repo = repo;
            _emailService = emailService;
            _cloudinaryService = cloudinaryService;
        }


        public async Task<ApiResponse<dynamic?>> GetUserByEmailAsync(string email)
        {
            var user = await _repo.GetUserByEmailAsync(email);

            return user != null
                ? ApiResponse<dynamic?>.SuccessResponse(200, "User fetched successfully", user)
                : ApiResponse<dynamic?>.FailResponse(404, "User not found");
        }

      
        public async Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(200, "Users fetched successfully", list);
        }

    
        public async Task<ApiResponse<dynamic?>> GetByIdAsync(int id)
        {
            var user = await _repo.GetByIdAsync(id);

            return user != null
                ? ApiResponse<dynamic?>.SuccessResponse(200, "User fetched successfully", user)
                : ApiResponse<dynamic?>.FailResponse(404, "User not found");
        }

        public async Task<ApiResponse<bool>> UpdateUserProfileAsync(UserProfileUpdateDto dto)
        {
            var existing = await _repo.GetByIdAsync(dto.Id);
            if (existing == null)
                return ApiResponse<bool>.FailResponse(404, "User not found");

            string? oldImage = existing.ProfileImage; 

            if (dto.ProfileImageFile != null)
            {
                using var stream = dto.ProfileImageFile.OpenReadStream();

                var cloudResult = await _cloudinaryService.UploadImageAsync(
       stream,
       dto.ProfileImageFile.FileName,
       "fieldops/users"
   );


                dto.ProfileImage = cloudResult.Url;

                if (!string.IsNullOrEmpty(oldImage))
                {
                    string publicId = ExtractPublicId(oldImage);
                    // Only attempt to delete if we extracted a valid public ID
                    if (!string.IsNullOrWhiteSpace(publicId))
                    {
                        try
                        {
                            await _cloudinaryService.DeleteImageAsync(publicId);
                        }
                        catch
                        {
                            // Ignore deletion errors - old image may not exist or URL format may be different
                        }
                    }
                }
            }
            else
            {
                dto.ProfileImage = oldImage;
            }

            var ok = await _repo.UpdateProfileAsync(dto);

            return ok
                ? ApiResponse<bool>.SuccessResponse(200, "Profile updated successfully", true)
                : ApiResponse<bool>.FailResponse(400, "Failed to update profile");
        }


        public async Task<ApiResponse<bool>> UpdateUserRoleAsync(UserRoleUpdateDto dto)
        {
            var existing = await _repo.GetByIdAsync(dto.Id);
            if (existing == null)
                return ApiResponse<bool>.FailResponse(404, "User not found");

            var ok = await _repo.UpdateRoleAsync(dto);

            return ok
                ? ApiResponse<bool>.SuccessResponse(200, "Role updated successfully", true)
                : ApiResponse<bool>.FailResponse(400, "Failed to update role");
        }


        public async Task<ApiResponse<bool>> DeleteUserAsync(int id, int deletedBy)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null)
                return ApiResponse<bool>.FailResponse(404, "User not found");

            var ok = await _repo.DeleteUserAsync(id, deletedBy);

            return ok
                ? ApiResponse<bool>.SuccessResponse(200, "User deleted successfully", true)
                : ApiResponse<bool>.FailResponse(400, "Failed to delete user");
        }

       
        public async Task<ApiResponse<string?>> GetPasswordHashAsync(int userId)
        {
            var hash = await _repo.GetPasswordHashAsync(userId);

            return hash != null
                ? ApiResponse<string?>.SuccessResponse(200, "Password hash fetched", hash)
                : ApiResponse<string?>.FailResponse(404, "User not found");
        }

        public async Task<ApiResponse<string>> ChangePasswordAsync(ChangePasswordDto dto)
        {
            var currentHash = await _repo.GetPasswordHashAsync(dto.UserId);

            if (currentHash == null)
                return new ApiResponse<string>(404, "User not found.");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, currentHash))
                return new ApiResponse<string>(400, "Current password is incorrect.");

            var newHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            var changed = await _repo.ChangePasswordAsync(dto.UserId, newHash, dto.ModifiedBy);
            if (!changed)
                return new ApiResponse<string>(400, "Failed to change password.");

            return new ApiResponse<string>(200, "Password changed successfully.");
        }


        
        public async Task<ApiResponse<string>> SendOtpAsync(ForgotPasswordDto dto)
        {
            var user = await _repo.GetUserByEmailAsync(dto.Email);

            if (user == null)
                return new ApiResponse<string>(404, "No user found with this email.");

            string otp = new Random().Next(100000, 999999).ToString();
            DateTime expiry = DateTime.UtcNow.AddMinutes(10);

            var saved = await _repo.SaveResetOtpAsync(dto.Email, otp, expiry);
            if (!saved)
                return new ApiResponse<string>(400, "Failed to generate OTP.");
            Console.WriteLine(saved);

            string body = $@"
                <h2>Password Reset</h2>
                <p>Your OTP code is:</p>
                <h1 style='color:#2d89ef'>{otp}</h1>
                <p>Valid for 10 minutes.</p>
            ";

            await _emailService.SendEmailAsync(dto.Email, "FieldOps Password Reset OTP", body);

            return new ApiResponse<string>(200, "OTP sent to email.");
        }


        public async Task<ApiResponse<string>> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var (otp, expiry) = await _repo.GetResetOtpAsync(dto.Email);

            if (otp == null)
                return new ApiResponse<string>(404, "OTP not found.");

            if (expiry < DateTime.UtcNow)
                return new ApiResponse<string>(400, "OTP has expired.");

            if (otp != dto.Otp)
                return new ApiResponse<string>(400, "Incorrect OTP.");

            string hash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            var ok = await _repo.ResetPasswordAsync(dto.Email, hash);
            if (!ok)
                return new ApiResponse<string>(400, "Failed to reset password.");

            return new ApiResponse<string>(200, "Password reset successful.");
        }
        private string ExtractPublicId(string url)
        {
            if (string.IsNullOrEmpty(url))
                return string.Empty;

            try
            {
                // Cloudinary URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{ext}
                // We need to extract everything after 'upload/v{version}/' without the extension
                var uri = new Uri(url);
                var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
                
                // Find the 'upload' segment index
                int uploadIndex = Array.IndexOf(segments, "upload");
                if (uploadIndex < 0 || uploadIndex >= segments.Length - 2)
                    return string.Empty;
                
                // Skip 'upload' and version segment (v123456...)
                var publicIdParts = segments.Skip(uploadIndex + 2).ToArray();
                if (publicIdParts.Length == 0)
                    return string.Empty;
                
                // Remove extension from the last segment
                var lastPart = publicIdParts[^1];
                var dotIndex = lastPart.LastIndexOf('.');
                if (dotIndex > 0)
                    publicIdParts[^1] = lastPart.Substring(0, dotIndex);
                
                return string.Join("/", publicIdParts);
            }
            catch
            {
                return string.Empty;
            }
        }

    }
}
