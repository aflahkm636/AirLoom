using Field_Ops.Application.common;
using Field_Ops.Application.DTO.CustomerDto;
using Field_Ops.Application.DTO.EmployeeDto;
using Field_Ops.Application.DTO.UserDto;
using Field_Ops.Application.DTOs.AuthDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface IAuthService
    {
        Task<ApiResponse<bool>> RegisterUserAsync(CustomerRegisterDto dto);
        Task<ApiResponse<bool>> CreateEmployeeAsync(EmployeeCreateDto dto);
        Task<AuthResponseDto> LoginAsync(UserLoginDto dto);
    }
}
