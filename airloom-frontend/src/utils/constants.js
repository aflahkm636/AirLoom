// API Base URL
export const API_BASE_URL = 'http://localhost:5195';

// Role-based route mappings
export const ROLE_ROUTES = {
  Admin: '/admin',
  Customer: '/customer',
  Staff: '/staff',
  Technician: '/technician',
};

// JWT claim key for role
export const ROLE_CLAIM_KEY = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

// LocalStorage keys
export const AUTH_STORAGE_KEY = 'airloom_auth';
