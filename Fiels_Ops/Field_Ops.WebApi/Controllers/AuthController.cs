using Field_ops.Domain;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.CustomerDto;
using Field_Ops.Application.DTO.EmployeeDto;
using Field_Ops.Application.DTO.UserDto;
using Field_Ops.Application.Helper;
using Field_Ops.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Field_Ops.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        [Authorize(Policy = Permissions.CUSTOMER_CREATE)]
        [HttpPost("customer")]
        public async Task<IActionResult> Register([FromForm] CustomerRegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            dto.CreatedBy = User.GetUserId();
            var response = await _authService.RegisterUserAsync(dto);

            return StatusCode(response.StatusCode, response);
        }

        [Authorize(Policy = Permissions.EMPLOYEE_CREATE)]
        [HttpPost("Employee")]
        public async Task<IActionResult> CreateEmployee([FromForm] EmployeeCreateDto dto)
        {
            dto.CreatedBy = User.GetUserId();
            var result = await _authService.CreateEmployeeAsync(dto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _authService.LoginAsync(dto);

            return StatusCode(response.StatusCode, response);
        }
    }
}
