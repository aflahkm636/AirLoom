import api from './api';

/**
 * Get all service tasks
 * @returns {Promise} API response with service tasks array
 */
export const getServiceTasks = async () => {
  try {
    const response = await api.get('/api/ServiceTasks');
    // API returns { statusCode, message, data: [...] }
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};
