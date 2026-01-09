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

/**
 * Get complaint by ID
 * @param {number} id - Complaint ID
 * @returns {Promise} API response with complaint details
 */
export const getComplaintById = async (id) => {
  const response = await api.get(`/api/Complaints/${id}`);
  return response.data;
};
