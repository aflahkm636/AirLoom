using Field_ops.Domain;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Field_Ops.Application.Authorization
{
    /// <summary>
    /// Handles permission-based authorization requirements.
    /// Admin role automatically passes all permission checks.
    /// Permissions are computed server-side based on role and departmentId.
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

            // Get role from claims
            var roleClaim = context.User.FindFirst(ClaimTypes.Role);
            if (roleClaim == null)
            {
                return Task.CompletedTask;
            }

            // Get departmentId if present (for Staff role)
            int? departmentId = null;
            var departmentClaim = context.User.FindFirst("departmentId");
            if (departmentClaim != null && int.TryParse(departmentClaim.Value, out int deptId))
            {
                departmentId = deptId;
            }

            // Compute permissions server-side based on role and department
            var permissions = RolePermissions.GetPermissions(roleClaim.Value, departmentId);
            
            if (permissions.Contains(requirement.Permission))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
