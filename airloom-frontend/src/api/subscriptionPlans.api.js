import api from './api';

// Get all subscription plans
export const getSubscriptionPlans = async () => {
  const response = await api.get('/api/SubscriptionPlans');
  return response.data;
};

// Get subscription plan by ID
export const getSubscriptionPlanById = async (id) => {
  const response = await api.get(`/api/SubscriptionPlans/${id}`);
  return response.data;
};

// Create subscription plan
export const createSubscriptionPlan = async (data) => {
  const response = await api.post('/api/SubscriptionPlans', data);
  return response.data;
};

// Update subscription plan
export const updateSubscriptionPlan = async (id, data) => {
  const response = await api.put(`/api/SubscriptionPlans/${id}`, data);
  return response.data;
};

// Delete subscription plan
export const deleteSubscriptionPlan = async (id) => {
  const response = await api.delete(`/api/SubscriptionPlans/${id}`);
  return response.data;
};
