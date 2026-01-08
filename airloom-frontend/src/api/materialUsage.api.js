import api from './api';

/**
 * Create material usage entry
 * @param {Object} data - { taskId, productId, quantityUsed, usageType }
 * @returns {Promise} API response
 */
export const createMaterialUsage = async (data) => {
  const response = await api.post('/api/MaterialUsage', data);
  return response.data;
};

/**
 * Get all material usage for a task
 * @param {number} taskId - Task ID
 * @returns {Promise} API response with material usage array
 */
export const getMaterialUsageByTask = async (taskId) => {
  const response = await api.get(`/api/MaterialUsage/task/${taskId}`);
  return response.data;
};

/**
 * Delete material usage entry
 * @param {number} id - Material usage ID
 * @returns {Promise} API response
 */
export const deleteMaterialUsage = async (id) => {
  const response = await api.delete(`/api/MaterialUsage/${id}`);
  return response.data;
};
