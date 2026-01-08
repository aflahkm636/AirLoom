using Field_ops.Domain;
using Field_Ops.Application.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Field_Ops.WebApi.Extensions
{
    public static class AuthExtensions
    {
        public static IServiceCollection AddFieldOpsAuthentication(
            this IServiceCollection services, IConfiguration config)
        {
            var jwt = config.GetSection("Jwt");
            var key = jwt["Key"] ?? throw new Exception("Jwt:Key is missing.");

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidIssuer = jwt["Issuer"],
                        ValidAudience = jwt["Audience"],
                        ClockSkew = TimeSpan.Zero
                    };
                });

            return services;
        }

        public static IServiceCollection AddFieldOpsAuthorization(
            this IServiceCollection services)
        {
            // Register PermissionHandler
            services.AddSingleton<IAuthorizationHandler, PermissionHandler>();

            services.AddAuthorization(options =>
            {
                // Register all permission-based policies
                foreach (var permission in Permissions.AllPermissions)
                {
                    options.AddPolicy(permission, policy =>
                        policy.Requirements.Add(new PermissionRequirement(permission)));
                }
            });

            return services;
        }
    }
}
