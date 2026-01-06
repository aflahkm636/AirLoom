import axios from 'axios';
import { notification } from 'antd';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'accept': '*/*',
  },
});

// Request interceptor - attach token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from Redux store
    const authState = localStorage.getItem('airloom_auth');
    if (authState) {
      try {
        const { token } = JSON.parse(authState);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing auth state:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized - token expired or invalid
      if (status === 401) {
        // Clear auth state and redirect to login
        localStorage.removeItem('airloom_auth');
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden - authenticated but lacks permission
      // Only show notification if user is already authenticated (not during login)
      if (status === 403) {
        const authState = localStorage.getItem('airloom_auth');
        if (authState) {
          notification.error({
            message: 'Access Denied',
            description: data?.message || 'You do not have permission to perform this action.',
            placement: 'topRight',
            duration: 4,
          });
        }
      }

      // Handle 500 Internal Server Error
      if (status === 500) {
        console.error('Server error:', data);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
