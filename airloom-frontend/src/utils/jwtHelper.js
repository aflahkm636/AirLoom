import { jwtDecode } from 'jwt-decode';
import { ROLE_CLAIM_KEY } from './constants';

/**
 * Decode JWT token and extract all claims
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token claims or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Extract user role from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} User role or null if not found
 */
export const getUserRole = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded) return null;
    
    const role = decoded[ROLE_CLAIM_KEY];
    if (!role) {
      console.error('Role claim not found in token');
      return null;
    }
    
    return role;
  } catch (error) {
    console.error('Error extracting role from token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired, false otherwise
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};
