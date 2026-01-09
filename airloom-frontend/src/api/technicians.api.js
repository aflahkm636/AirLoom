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
 * Get technician tasks with optional employeeId and status filter
 * If employeeId is not provided, backend resolves it from JWT token
 * Supports two calling patterns:
 *   - getTechnicianTasks(status) - for technician viewing own tasks
 *   - getTechnicianTasks(employeeId, status) - for admin viewing specific technician
 * @param {number|string|null} employeeIdOrStatus - employeeId (number) or status (string) or null
 * @param {string} status - Optional status filter when first param is employeeId
 * @returns {Promise} API response with technician tasks
 */
export const getTechnicianTasks = async (employeeIdOrStatus = null, status = '') => {
  let url = '/api/TaskEmployees/technician';
  const params = new URLSearchParams();
  
  // Detect calling pattern: if first arg is string, it's status only
  let employeeId = null;
  let statusFilter = status;
  
  if (typeof employeeIdOrStatus === 'string') {
    // Called as getTechnicianTasks(status)
    statusFilter = employeeIdOrStatus;
  } else if (typeof employeeIdOrStatus === 'number') {
    // Called as getTechnicianTasks(employeeId, status)
    employeeId = employeeIdOrStatus;
  }
  
  if (employeeId) {
    params.append('employeeId', employeeId);
  }
  if (statusFilter) {
    params.append('status', statusFilter);
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
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

