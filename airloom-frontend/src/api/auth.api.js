import api from './api';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} API response with statusCode, message, and accessToken
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/api/Auth/login', {
      email,
      password,
    });
    
    return response.data;
  } catch (error) {
    // Re-throw error to be handled by Redux thunk
    throw error;
  }
};

/**
 * Fetch current user's profile (uses JWT token to identify user)
 * @returns {Promise} API response with data containing user profile
 */
export const getUserProfile = async () => {
  const response = await api.get('/api/users/Profile');
  return response.data;
};

/**
 * Fetch current user's permissions (computed server-side based on role and department)
 * @returns {Promise} API response with data containing role, departmentId, and permissions array
 */
export const getUserPermissions = async () => {
  const response = await api.get('/api/users/me/permissions');
  return response.data;
};

