namespace Field_ops.Domain
{
    /// <summary>
    /// Centralized permission constants for the application.
    /// Used with permission-based authorization policies.
    /// </summary>
    public static class Permissions
    {
        // Department Management
        public const string DEPARTMENT_VIEW = "DEPARTMENT_VIEW";
        public const string DEPARTMENT_CREATE = "DEPARTMENT_CREATE";
        public const string DEPARTMENT_UPDATE = "DEPARTMENT_UPDATE";
        public const string DEPARTMENT_DELETE = "DEPARTMENT_DELETE";

        // Employee
        public const string EMPLOYEE_VIEW = "EMPLOYEE_VIEW";
        public const string EMPLOYEE_CREATE = "EMPLOYEE_CREATE";
        public const string EMPLOYEE_UPDATE = "EMPLOYEE_UPDATE";
        public const string EMPLOYEE_DELETE = "EMPLOYEE_DELETE";

        // Customer
        public const string CUSTOMER_VIEW = "CUSTOMER_VIEW";
        public const string CUSTOMER_CREATE = "CUSTOMER_CREATE";

        // User Management
        public const string USER_VIEW_ALL = "USER_VIEW_ALL";
        public const string USER_UPDATE_ROLE = "USER_UPDATE_ROLE";
        public const string USER_DELETE = "USER_DELETE";

        // Technician
        public const string TECHNICIAN_VIEW = "TECHNICIAN_VIEW";

        // Subscription Plans
        public const string SUBSCRIPTION_PLAN_VIEW = "SUBSCRIPTION_PLAN_VIEW";
        public const string SUBSCRIPTION_PLAN_CREATE = "SUBSCRIPTION_PLAN_CREATE";
        public const string SUBSCRIPTION_PLAN_UPDATE = "SUBSCRIPTION_PLAN_UPDATE";
        public const string SUBSCRIPTION_PLAN_DELETE = "SUBSCRIPTION_PLAN_DELETE";

        // Subscriptions
        public const string SUBSCRIPTION_VIEW = "SUBSCRIPTION_VIEW";
        public const string SUBSCRIPTION_CREATE = "SUBSCRIPTION_CREATE";
        public const string SUBSCRIPTION_UPDATE = "SUBSCRIPTION_UPDATE";
        public const string SUBSCRIPTION_MANAGE = "SUBSCRIPTION_MANAGE";

        // Service Tasks
        public const string TASK_VIEW = "TASK_VIEW";
        public const string TASK_CREATE = "TASK_CREATE";
        public const string TASK_UPDATE = "TASK_UPDATE";
        public const string TASK_UPDATE_STATUS = "TASK_UPDATE_STATUS";
        public const string TASK_COMPLETE = "TASK_COMPLETE";

        // Task Employees
        public const string TASK_ASSIGN = "TASK_ASSIGN";
        public const string TASK_REMOVE_ASSIGNMENT = "TASK_REMOVE_ASSIGNMENT";
        public const string TASK_VIEW_ASSIGNMENTS = "TASK_VIEW_ASSIGNMENTS";
        public const string TASK_VIEW_OWN = "TASK_VIEW_OWN";

        // Inventory
        public const string INVENTORY_VIEW = "INVENTORY_VIEW";
        public const string INVENTORY_CREATE = "INVENTORY_CREATE";
        public const string INVENTORY_UPDATE = "INVENTORY_UPDATE";
        public const string INVENTORY_DELETE = "INVENTORY_DELETE";
        public const string INVENTORY_MANAGE_STOCK = "INVENTORY_MANAGE_STOCK";

        // Material Usage
        public const string MATERIAL_USAGE_CREATE = "MATERIAL_USAGE_CREATE";
        public const string MATERIAL_USAGE_VIEW = "MATERIAL_USAGE_VIEW";
        public const string MATERIAL_USAGE_DELETE = "MATERIAL_USAGE_DELETE";
        public const string MATERIAL_USAGE_APPROVE = "MATERIAL_USAGE_APPROVE";

        // Billing
        public const string BILLING_VIEW = "BILLING_VIEW";
        public const string BILLING_UPDATE_DISCOUNT = "BILLING_UPDATE_DISCOUNT";
        public const string BILLING_FINALIZE = "BILLING_FINALIZE";
        public const string BILLING_VIEW_OWN = "BILLING_VIEW_OWN";

        // Complaints
        public const string COMPLAINT_VIEW = "COMPLAINT_VIEW";
        public const string COMPLAINT_CREATE_OWN = "COMPLAINT_CREATE_OWN";
        public const string COMPLAINT_UPDATE = "COMPLAINT_UPDATE";
        public const string COMPLAINT_UPDATE_STATUS = "COMPLAINT_UPDATE_STATUS";
        public const string COMPLAINT_DELETE_OWN = "COMPLAINT_DELETE_OWN";
        public const string COMPLAINT_VIEW_ASSIGNED = "COMPLAINT_VIEW_ASSIGNED";

        /// <summary>
        /// All permissions in the system. Used for Admin role.
        /// </summary>
        public static readonly string[] AllPermissions = new[]
        {
            DEPARTMENT_VIEW, DEPARTMENT_CREATE, DEPARTMENT_UPDATE, DEPARTMENT_DELETE,
            EMPLOYEE_VIEW, EMPLOYEE_CREATE, EMPLOYEE_UPDATE, EMPLOYEE_DELETE,
            CUSTOMER_VIEW, CUSTOMER_CREATE,
            USER_VIEW_ALL, USER_UPDATE_ROLE, USER_DELETE,
            TECHNICIAN_VIEW,
            SUBSCRIPTION_PLAN_VIEW, SUBSCRIPTION_PLAN_CREATE, SUBSCRIPTION_PLAN_UPDATE, SUBSCRIPTION_PLAN_DELETE,
            SUBSCRIPTION_VIEW, SUBSCRIPTION_CREATE, SUBSCRIPTION_UPDATE, SUBSCRIPTION_MANAGE,
            TASK_VIEW, TASK_CREATE, TASK_UPDATE, TASK_UPDATE_STATUS, TASK_COMPLETE,
            TASK_ASSIGN, TASK_REMOVE_ASSIGNMENT, TASK_VIEW_ASSIGNMENTS, TASK_VIEW_OWN,
            INVENTORY_VIEW, INVENTORY_CREATE, INVENTORY_UPDATE, INVENTORY_DELETE, INVENTORY_MANAGE_STOCK,
            MATERIAL_USAGE_CREATE, MATERIAL_USAGE_VIEW, MATERIAL_USAGE_DELETE, MATERIAL_USAGE_APPROVE,
            BILLING_VIEW, BILLING_UPDATE_DISCOUNT, BILLING_FINALIZE, BILLING_VIEW_OWN,
            COMPLAINT_VIEW, COMPLAINT_CREATE_OWN, COMPLAINT_UPDATE, COMPLAINT_UPDATE_STATUS, COMPLAINT_DELETE_OWN, COMPLAINT_VIEW_ASSIGNED
        };
    }
}
