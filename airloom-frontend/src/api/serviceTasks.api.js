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

/**
 * Get service task by ID
 * @param {number} id - Task ID
 * @returns {Promise} API response with task details
 */
export const getServiceTaskById = async (id) => {
  const response = await api.get(`/api/ServiceTasks/${id}`);
  return response.data;
};

/**
 * Create new service task
 * @param {Object} data - Task data
 * @returns {Promise} API response
 */
export const createServiceTask = async (data) => {
  const response = await api.post('/api/ServiceTasks', data);
  return response.data;
};

/**
 * Update service task
 * @param {number} id - Task ID
 * @param {Object} data - Updated task data
 * @returns {Promise} API response
 */
export const updateServiceTask = async (id, data) => {
  const response = await api.put(`/api/ServiceTasks/${id}`, data);
  return response.data;
};

/**
 * Update task status
 * @param {number} id - Task ID
 * @param {Object} data - Status change data { id, status, notes, employeeId }
 * @returns {Promise} API response
 */
export const updateTaskStatus = async (id, data) => {
  const response = await api.patch(`/api/ServiceTasks/${id}/status`, data);
  return response.data;
};

/**
 * Delete service task
 * @param {number} id - Task ID
 * @returns {Promise} API response
 */
export const deleteServiceTask = async (id) => {
  const response = await api.delete(`/api/ServiceTasks/${id}`);
  return response.data;
};

/**
 * Get tasks awaiting approval
 * @returns {Promise} API response with awaiting approval tasks
 */
export const getAwaitingApprovalTasks = async () => {
  const response = await api.get('/api/ServiceTasks/awaiting-approval');
  return response.data;
};

/**
 * Get all assigned technicians for a task
 * @param {number} taskId - Task ID
 * @returns {Promise} API response with task assignments
 */
export const getTaskAssignments = async (taskId) => {
  const response = await api.get(`/api/TaskEmployees/task/${taskId}`);
  return response.data;
};

/**
 * Assign a technician to a task
 * @param {Object} data - Assignment data { taskId, employeeId, role }
 * @returns {Promise} API response
 */
export const assignTechnicianToTask = async (data) => {
  const response = await api.post('/api/TaskEmployees/assign', data);
  return response.data;
};

/**
 * Remove a technician assignment from a task
 * @param {number} assignmentId - Assignment ID
 * @returns {Promise} API response
 */
export const removeTaskAssignment = async (assignmentId) => {
  const response = await api.delete(`/api/TaskEmployees/${assignmentId}/remove`);
  return response.data;
};

/**
 * Get specific assignment by ID
 * @param {number} assignmentId - Assignment ID
 * @returns {Promise} API response with assignment details
 */
export const getAssignmentById = async (assignmentId) => {
  const response = await api.get(`/api/TaskEmployees/${assignmentId}`);
  return response.data;
};
