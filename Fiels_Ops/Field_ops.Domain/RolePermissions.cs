namespace Field_ops.Domain
{
    /// <summary>
    /// Maps permissions to roles based on department.
    /// Staff permissions are determined by their department.
    /// </summary>
    public static class RolePermissions
    {
        // Common Staff permissions (all departments get these)
        private static readonly string[] CommonStaffPermissions = new[]
        {
            Permissions.DEPARTMENT_VIEW,
            Permissions.TECHNICIAN_VIEW,
            Permissions.CUSTOMER_VIEW,
        };

        /// <summary>
        /// Department-specific permissions for Staff role.
        /// Key: DepartmentId, Value: Array of permission strings
        /// </summary>
        public static readonly Dictionary<int, string[]> StaffPermissionsByDepartment = new()
        {
            [1] = new[] // Human Resources
            {
                Permissions.EMPLOYEE_VIEW,
                Permissions.EMPLOYEE_CREATE,
                Permissions.EMPLOYEE_UPDATE,
            },
            [2] = new[] // Operations
            {
                Permissions.TASK_VIEW,
                Permissions.TASK_CREATE,
                Permissions.TASK_UPDATE,
                Permissions.TASK_UPDATE_STATUS,
                Permissions.TASK_COMPLETE,
                Permissions.TASK_ASSIGN,
                Permissions.TASK_REMOVE_ASSIGNMENT,
                Permissions.TASK_VIEW_ASSIGNMENTS,
                Permissions.MATERIAL_USAGE_APPROVE,
                Permissions.MATERIAL_USAGE_VIEW,
            },
            [3] = new[] // IT Support
            {
                Permissions.USER_VIEW_ALL,
            },
            [4] = new[] // Inventory & Logistics
            {
                Permissions.INVENTORY_VIEW,
                Permissions.INVENTORY_CREATE,
                Permissions.INVENTORY_UPDATE,
                Permissions.INVENTORY_DELETE,
                Permissions.INVENTORY_MANAGE_STOCK,
                Permissions.MATERIAL_USAGE_VIEW,
                Permissions.MATERIAL_USAGE_DELETE,
            },
            [5] = new[] // Finance & Accounting
            {
                Permissions.BILLING_VIEW,
                Permissions.BILLING_UPDATE_DISCOUNT,
                Permissions.BILLING_FINALIZE,
                Permissions.SUBSCRIPTION_VIEW,
            },
            [6] = new[] // Sales & Marketing
            {
                Permissions.CUSTOMER_VIEW,
                Permissions.CUSTOMER_CREATE,
                Permissions.SUBSCRIPTION_VIEW,
                Permissions.SUBSCRIPTION_CREATE,
                Permissions.SUBSCRIPTION_UPDATE,
                Permissions.SUBSCRIPTION_MANAGE,
                Permissions.SUBSCRIPTION_PLAN_VIEW,
            },
            [7] = new[] // Customer Service
            {
                Permissions.COMPLAINT_VIEW,
                Permissions.COMPLAINT_UPDATE,
                Permissions.COMPLAINT_UPDATE_STATUS,
                Permissions.CUSTOMER_VIEW,
                Permissions.TASK_CREATE, // Can create tasks for complaints
            },
        };

        /// <summary>
        /// Technician permissions (no department needed)
        /// </summary>
        public static readonly string[] TechnicianPermissions = new[]
        {
            Permissions.TASK_VIEW_OWN,
            Permissions.TASK_UPDATE_STATUS,
            Permissions.TASK_VIEW_ASSIGNMENTS,
            Permissions.MATERIAL_USAGE_CREATE,
            Permissions.MATERIAL_USAGE_VIEW,
            Permissions.COMPLAINT_VIEW_ASSIGNED,
            Permissions.COMPLAINT_UPDATE_STATUS,
            Permissions.INVENTORY_VIEW,  // Allow viewing products/inventory
        };

        /// <summary>
        /// Customer permissions
        /// </summary>
        public static readonly string[] CustomerPermissions = new[]
        {
            Permissions.BILLING_VIEW_OWN,
            Permissions.COMPLAINT_CREATE_OWN,
            Permissions.COMPLAINT_DELETE_OWN,
        };

        /// <summary>
        /// Gets permissions for a user based on their role and department.
        /// </summary>
        /// <param name="role">User's role</param>
        /// <param name="departmentId">Department ID (required for Staff)</param>
        /// <returns>Array of permission strings</returns>
        public static string[] GetPermissions(string role, int? departmentId = null)
        {
            return role switch
            {
                "Admin" => Permissions.AllPermissions,
                "Staff" when departmentId.HasValue =>
                    CommonStaffPermissions
                        .Concat(StaffPermissionsByDepartment.GetValueOrDefault(departmentId.Value, Array.Empty<string>()))
                        .Distinct()
                        .ToArray(),
                "Staff" => CommonStaffPermissions,
                "Technician" => TechnicianPermissions,
                "Customer" => CustomerPermissions,
                _ => Array.Empty<string>()
            };
        }
    }
}
