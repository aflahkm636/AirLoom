import api from './api';

export const getCustomers = async () => {
  const response = await api.get('/api/Customer/all');
  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await api.get(`/api/Customer/${id}`);
  return response.data;
};

export const createCustomer = async (formData) => {
  const response = await api.post('/api/Auth/customer', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
