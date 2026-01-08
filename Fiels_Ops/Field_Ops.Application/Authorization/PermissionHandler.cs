using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Field_Ops.Application.Authorization
{
    /// <summary>
    /// Handles permission-based authorization requirements.
    /// Admin role automatically passes all permission checks.
    /// </summary>
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            // Admin bypasses ALL permission checks
            if (context.User.IsInRole("Admin"))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            // Check permissions claim
            var permissionsClaim = context.User.FindFirst("permissions");
            if (permissionsClaim != null && !string.IsNullOrEmpty(permissionsClaim.Value))
            {
                var permissions = permissionsClaim.Value.Split(',', StringSplitOptions.RemoveEmptyEntries);
                if (permissions.Contains(requirement.Permission))
                {
                    context.Succeed(requirement);
                }
            }

            return Task.CompletedTask;
        }
    }
}
