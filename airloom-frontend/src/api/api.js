import axios from 'axios';
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
    // Get token from Redux store (will be set up later)
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
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        // Clear auth state and redirect to login
        localStorage.removeItem('airloom_auth');
        window.location.href = '/login';
      }
      
      // Handle 500 Internal Server Error
      if (error.response.status === 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
