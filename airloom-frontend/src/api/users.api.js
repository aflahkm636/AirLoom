import api from './api';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

/**
 * Update user profile (multipart/form-data)
 * @param {FormData} formData - Form data containing Name, Phone, ProfileImageFile, ProfileImage
 * @returns {Promise} API response
 */
export const updateUserProfile = async (formData) => {
  const response = await api.put('/api/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Change password for authenticated user
 * @param {{ currentPassword: string, newPassword: string }} data
 * @returns {Promise} API response
 */
export const changePassword = async (data) => {
  const response = await api.post('/api/users/change-password', data);
  return response.data;
};

/**
 * Send OTP to email for password reset (no auth required)
 * @param {{ email: string }} data
 * @returns {Promise} API response
 */
export const sendOtp = async (data) => {
  // Use axios directly without auth interceptor for public endpoints
  const response = await axios.post(`${API_BASE_URL}/api/users/send-otp`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

/**
 * Reset password with OTP (no auth required)
 * @param {{ email: string, otp: string, newPassword: string }} data
 * @returns {Promise} API response
 */
export const resetPassword = async (data) => {
  // Use axios directly without auth interceptor for public endpoints
  const response = await axios.post(`${API_BASE_URL}/api/users/reset-password`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// ============================================
// ADMIN USER MANAGEMENT APIs
// ============================================

/**
 * Get all users (Admin only)
 * @returns {Promise} API response with users list
 */
export const getAllUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

/**
 * Get user by ID (Admin only)
 * @param {number} id - User ID
 * @returns {Promise} API response with user data
 */
export const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

/**
 * Update user role (Admin only)
 * @param {{ id: number, role: number }} data - User ID and new role value
 * @returns {Promise} API response
 */
export const updateUserRole = async (data) => {
  const response = await api.put('/api/users/role', data);
  return response.data;
};

/**
 * Role mapping constants
 */
export const ROLE_OPTIONS = [
  { value: 0, label: 'Staff' },
  { value: 1, label: 'Customer' },
  { value: 2, label: 'Technician' },
  { value: 3, label: 'Admin' },
];

export const getRoleName = (roleValue) => {
  const role = ROLE_OPTIONS.find(r => r.value === roleValue);
  return role ? role.label : roleValue;
};

export const getRoleValue = (roleName) => {
  const role = ROLE_OPTIONS.find(r => r.label === roleName);
  return role ? role.value : null;
};
