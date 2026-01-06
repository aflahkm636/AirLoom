import api from './api';

/**
 * Get all active technicians
 * @returns {Promise} API response with active technicians array
 */
export const getActiveTechnicians = async () => {
  const response = await api.get('/api/Technicians/active');
  return response.data;
};

/**
 * Get technician by ID
 * @param {number} id - Technician EmployeeId
 * @returns {Promise} API response with technician details
 */
export const getTechnicianById = async (id) => {
  const response = await api.get(`/api/Technicians/${id}`);
  return response.data;
};

/**
 * Get technician tasks with optional status filter
 * @param {number} employeeId - Employee ID
 * @param {string} status - Optional status filter (e.g., 'completed', 'pending')
 * @returns {Promise} API response with technician tasks
 */
export const getTechnicianTasks = async (employeeId, status = '') => {
  let url = `/api/TaskEmployees/technician?employeeId=${employeeId}`;
  if (status) {
    url += `&status=${status}`;
  }
  const response = await api.get(url);
  return response.data;
};
