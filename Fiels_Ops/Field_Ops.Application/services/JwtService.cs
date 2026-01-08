using System;
using System.Collections.Generic;
using Field_ops.Domain;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.UserDto;
using Field_Ops.Application.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class JwtTokenService : IJwtTokenService
{
    private readonly JwtSettings _jwt;

    public JwtTokenService(IOptions<JwtSettings> jwtOptions)
    {
        _jwt = jwtOptions.Value;
    }

    public string GenerateToken(UserForJwtDto user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Get permissions based on role and department
        var permissions = RolePermissions.GetPermissions(user.Role, user.DepartmentId);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim("UserId", user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.UserEmail),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("UserName", user.UserName),
            new Claim("permissions", string.Join(",", permissions))
        };

        // Add role-specific claims
        if (user.Role == "Staff" && user.DepartmentId.HasValue)
        {
            claims.Add(new Claim("departmentId", user.DepartmentId.Value.ToString()));
        }

        if (user.Role == "Customer" && user.CustomerId.HasValue)
        {
            claims.Add(new Claim("customerId", user.CustomerId.Value.ToString()));
        }

        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
