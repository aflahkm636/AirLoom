import api from './api';

export const getProducts = async (page, pageSize) => {
  const response = await api.get(`/api/Inventory/all?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/Inventory/${id}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post('/api/Inventory/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (formData) => {
  const response = await api.put('/api/Inventory/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/Inventory/delete/${id}`);
  return response.data;
};

export const filterProducts = async (filters) => {
  const response = await api.post('/api/Inventory/filter', filters);
  return response.data;
};

export const increaseStock = async (id, qty) => {
  const response = await api.post(`/api/Inventory/increase?id=${id}&qty=${qty}`);
  return response.data;
};

export const decreaseStock = async (id, qty) => {
  const response = await api.post(`/api/Inventory/decrease?id=${id}&qty=${qty}`);
  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await api.get('/api/Inventory/low-stock');
  return response.data;
};

export const getInventoryValue = async () => {
  const response = await api.get('/api/Inventory/inventory-value');
  return response.data;
};
