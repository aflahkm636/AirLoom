// Auth selectors

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectUser = (state) => state.auth.user;

export const selectUserRole = (state) => state.auth.user?.role;

export const selectUserName = (state) => state.auth.user?.name || state.auth.user?.userName || 'User';

export const selectUserId = (state) => state.auth.user?.id;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectAuthError = (state) => state.auth.error;

export const selectUserPermissions = (state) => state.auth.user?.permissions || [];

export const selectUserDepartmentId = (state) => state.auth.user?.departmentId || null;

export const selectUserProfileImage = (state) => state.auth.user?.profileImage || null;

// Department name mapping
const DEPARTMENT_NAMES = {
  1: 'Human Resources',
  2: 'Operations',
  3: 'IT Support',
  4: 'Inventory & Logistics',
  5: 'Finance & Accounting',
  6: 'Sales & Marketing',
  7: 'Customer Service',
};

export const selectUserDepartmentName = (state) => {
  const deptId = state.auth.user?.departmentId;
  return deptId ? DEPARTMENT_NAMES[deptId] || 'Unknown Department' : null;
};

export const selectProfileFetched = (state) => state.auth.profileFetched;

// Note: Token is NOT exposed as a selector (security best practice)
// Token is only used internally by Axios interceptor


