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
 * Backend resolves employeeId from JWT token
 * @param {string} status - Optional status filter (pending, inprogress, completed)
 * @returns {Promise} API response with technician tasks
 */
export const getTechnicianTasks = async (status = '') => {
  let url = '/api/TaskEmployees/technician';
  if (status) {
    url += `?status=${status}`;
  }
  const response = await api.get(url);
  return response.data;
};

/**
 * Get complaints assigned to the logged-in technician
 * @returns {Promise} API response with assigned complaints
 */
export const getAssignedComplaints = async () => {
  const response = await api.get('/api/Complaints/assigned-to-technician');
  return response.data;
};

