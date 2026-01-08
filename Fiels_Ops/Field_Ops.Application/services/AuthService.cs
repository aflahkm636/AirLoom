using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.CustomerDto;
using Field_Ops.Application.DTO.EmployeeDto;
using Field_Ops.Application.DTO.UserDto;
using Field_Ops.Application.DTOs.AuthDto;
using Field_Ops.Application.Helper;

namespace Field_Ops.Application.Services
{
    public class AuthService:IAuthService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;
        private readonly IEmployeesRepository _employeesRepository;
        private readonly ICloudinaryService _cloudinaryService;

        public AuthService(
            ICustomerRepository customerRepository,
            IUsersRepository usersRepository,
            IJwtTokenService jwtTokenService,
            IEmailService emailService,
            IEmployeesRepository employeesRepository,
            ICloudinaryService cloudinaryService)
        {
            _customerRepository = customerRepository;
            _usersRepository = usersRepository;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
            _employeesRepository = employeesRepository;
            _cloudinaryService = cloudinaryService;
        }


        public async Task<ApiResponse<bool>> RegisterUserAsync(CustomerRegisterDto dto)
        {
            dto.Email = dto.Email.Trim().ToLower();

            string tempPassword = string.IsNullOrWhiteSpace(dto.PasswordHash)
                ? PasswordHelper.GenerateTemporaryPassword()
                : dto.PasswordHash;

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(tempPassword);
            dto.PasswordHash = hashedPassword;
            if (dto.ProfileImageFile != null)
            {
                using var stream = dto.ProfileImageFile.OpenReadStream();

                var cloudResult = await _cloudinaryService.UploadImageAsync(
                    stream,
                    dto.ProfileImageFile.FileName,
                    "Field_Ops/customers"
                );

                dto.ProfileImage = cloudResult.Url;
            }
            else
            {
                dto.ProfileImage = null; 
            }

            var isCreated = await _customerRepository.AddCustomerAsync(dto);

            if (!isCreated)
                return ApiResponse<bool>.FailResponse(400, "User + Customer registration failed");

            string subject = "Welcome to Field_Ops";
            string body = $@"
        <h3>Hello {dto.Name},</h3>
        <p>Your Field_Ops account has been created successfully.</p>
        <p><b>Email:</b> {dto.Email}<br>
        <b>Temporary Password:</b> {tempPassword}</p>
        <p>Please log in and change your password immediately.</p>
        <p>Best regards,<br>Field_Ops Team</p>";

            await _emailService.SendEmailAsync(dto.Email, subject, body);

            return ApiResponse<bool>.SuccessResponse(
                201,
                $"Customer created successfully! Login details sent to {dto.Email}."
            );
        }


        public async Task<ApiResponse<bool>> CreateEmployeeAsync(EmployeeCreateDto dto)

        {
            //if (string.IsNullOrWhiteSpace(dto.Name))
            //    throw new ArgumentException("Name is required.");

            //if (string.IsNullOrWhiteSpace(dto.Email))
            //    throw new ArgumentException("Email is required.");

            //if (string.IsNullOrWhiteSpace(dto.PasswordHash))
            //    throw new ArgumentException("PasswordHash is required.");


            //if (dto.Role.ToString() == "Technician" && dto.DepartmentId != 2)

            string tempPassword = string.IsNullOrWhiteSpace(dto.Password)
              ? PasswordHelper.GenerateTemporaryPassword()
              : dto.Password;

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(tempPassword);

            dto.Password = hashedPassword;
            if (dto.ProfileImageFile != null)
            {
                using var stream = dto.ProfileImageFile.OpenReadStream();

                var cloudResult = await _cloudinaryService.UploadImageAsync(
                    stream,
                    dto.ProfileImageFile.FileName,
                    "Field_Ops/employees"
                );

                dto.ProfileImage = cloudResult.Url;
            }
            else
            {
                dto.ProfileImage = null; 
            }

            var isCreated = await _employeesRepository.CreateEmployeeAsync(dto);

            if (!isCreated)
                return ApiResponse<bool>.FailResponse(400, "Employee creation failed");

            string subject = "Welcome to Field_Ops";
            string body = $@"
        <h3>Hello {dto.Name},</h3>
        <p>Your Field_Ops account has been created successfully.</p>
        <p><b>Email:</b> {dto.Email}<br>
        <b>Temporary Password:</b> {tempPassword}</p>
        <p>Please log in and change your password immediately.</p>
        <p>Best regards,<br>Field_Ops Team</p>";

            await _emailService.SendEmailAsync(dto.Email, subject, body);

            return ApiResponse<bool>.SuccessResponse(201, $"Staff created successfully! Credentials sent to {dto.Email}.");
        }

        public async Task<AuthResponseDto> LoginAsync(UserLoginDto dto)
        {
            var user = await _usersRepository.GetUserByEmailAsync(dto.Email);

            if (user == null)
                return new AuthResponseDto(400, "Invalid credentials");
            //if (!user.Active)
            //    return new AuthResponseDto(403, "Account is inactive");
            if (user.IsDeleted)
                return new AuthResponseDto(403, "Account has been deleted");


            bool valid = BCrypt.Net.BCrypt.Verify(dto.Password, (string)user.PasswordHash);
            if (!valid)
                return new AuthResponseDto(400, "Invalid credentials");

            var jwtUser = UserDtoMapper.FromDynamic(user);

            string token = _jwtTokenService.GenerateToken(jwtUser);

            return new AuthResponseDto(200, "Login successful", token);
        }

    }
}
