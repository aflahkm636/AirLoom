import api from './api';

// --- Subscription Plans ---

export const getSubscriptionPlans = async () => {
  const response = await api.get('/api/SubscriptionPlans');
  return response.data;
};

export const getSubscriptionPlanById = async (id) => {
  const response = await api.get(`/api/SubscriptionPlans/${id}`);
  return response.data;
};

export const createSubscriptionPlan = async (data) => {
  const response = await api.post('/api/SubscriptionPlans', data);
  return response.data;
};

export const updateSubscriptionPlan = async (id, data) => {
  const response = await api.put(`/api/SubscriptionPlans/${id}`, data);
  return response.data;
};

export const deleteSubscriptionPlan = async (id) => {
  const response = await api.delete(`/api/SubscriptionPlans/${id}`);
  return response.data;
};

// --- Subscriptions ---

export const getSubscriptions = async () => {
  const response = await api.get('/api/Subscriptions');
  return response.data;
};

export const getSubscriptionById = async (id) => {
  const response = await api.get(`/api/Subscriptions/${id}`);
  return response.data;
};

export const createSubscription = async (data) => {
  const response = await api.post('/api/Subscriptions', data);
  return response.data;
};

export const updateSubscription = async (data) => {
  const response = await api.put('/api/Subscriptions', data);
  return response.data;
};

export const pauseSubscription = async (id) => {
  const response = await api.put(`/api/Subscriptions/${id}/pause`);
  return response.data;
};

export const resumeSubscription = async (id) => {
  const response = await api.put(`/api/Subscriptions/${id}/resume`);
  return response.data;
};

export const cancelSubscription = async (id) => {
  const response = await api.put(`/api/Subscriptions/${id}/cancel`);
  return response.data;
};
