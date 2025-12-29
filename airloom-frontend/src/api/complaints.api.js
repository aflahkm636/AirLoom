import api from './api';

/**
 * Get all complaints
 * @returns {Promise} API response with complaints array
 */
export const getComplaints = async () => {
  try {
    const response = await api.get('/api/Complaints');
    // API returns { statusCode, message, data: [...] }
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};
