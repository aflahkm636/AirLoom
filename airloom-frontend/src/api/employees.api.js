import api from './api';

// Get all employees
export const getEmployees = async () => {
  const response = await api.get('/api/Employees');
  return response.data;
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  const response = await api.get(`/api/Employees/${id}`);
  return response.data;
};

// Create new employee (multipart/form-data)
export const createEmployee = async (formData) => {
  const response = await api.post('/api/Auth/Employee', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update employee (JSON)
export const updateEmployee = async (data) => {
  const response = await api.put('/api/Employees', data);
  return response.data;
};

// Delete employee
export const deleteEmployee = async (id) => {
  const response = await api.delete(`/api/Employees/${id}`);
  return response.data;
};

// Get all departments
export const getDepartments = async () => {
  const response = await api.get('/api/Departments');
  return response.data;
};
