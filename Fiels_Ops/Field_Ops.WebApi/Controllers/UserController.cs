using Field_ops.Domain;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.UserDto;
using Field_Ops.Application.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Field_Ops.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }


        [Authorize(Policy = Permissions.USER_VIEW_ALL)]
        [HttpGet]

        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return StatusCode(result.StatusCode, result);
        }

       
        [Authorize(Policy = Permissions.USER_VIEW_ALL)]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        [Authorize]
        [HttpGet("Profile")]
        public async Task<IActionResult> GetProfile()
        {
            int id = User.GetUserId();
            var result = await _service.GetByIdAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UserProfileUpdateDto dto)
        {
            dto.Id = User.GetUserId();
            dto.ModifiedBy = User.GetUserId();

            var result = await _service.UpdateUserProfileAsync(dto);
            return StatusCode(result.StatusCode, result);
        }

        [Authorize(Policy = Permissions.USER_UPDATE_ROLE)]
        [HttpPut("role")]
        public async Task<IActionResult> UpdateRole([FromBody] UserRoleUpdateDto dto)
        {
            dto.ModifiedBy = User.GetUserId();

            var result = await _service.UpdateUserRoleAsync(dto);
            return StatusCode(result.StatusCode, result);
        }

        [Authorize(Policy = Permissions.USER_DELETE)]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var adminId = ClaimsHelper.GetUserId(User);
            int deletedBy = adminId;
            var result = await _service.DeleteUserAsync(id, deletedBy);
            return StatusCode(result.StatusCode, result);
        }

        [Authorize]
        [HttpPost("change-password")]
        
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            dto.UserId = User.GetUserId();
            dto.ModifiedBy = User.GetUserId();
            var result = await _service.ChangePasswordAsync(dto);
            return StatusCode(result.StatusCode, result);
        }

 
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp(ForgotPasswordDto dto)
        {
            var result = await _service.SendOtpAsync(dto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var result = await _service.ResetPasswordAsync(dto);
            return StatusCode(result.StatusCode, result);
        }
    }
}
