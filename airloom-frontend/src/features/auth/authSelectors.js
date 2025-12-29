// Auth selectors

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectUser = (state) => state.auth.user;

export const selectUserRole = (state) => state.auth.user?.role;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectAuthError = (state) => state.auth.error;

// Note: Token is NOT exposed as a selector (security best practice)
// Token is only used internally by Axios interceptor
