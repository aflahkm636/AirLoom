import api from './api';

// ============================================
// BILLING STATUS CONSTANTS
// ============================================
export const BILL_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
};

// ============================================
// ADMIN/STAFF BILLING APIs
// ============================================

/**
 * Get all pending bills (Admin/Staff only)
 * @returns {Promise} API response with pending bills list
 */
export const getPendingBills = async () => {
  const response = await api.get('/api/Billing/pending');
  return response.data;
};

/**
 * Get bill by ID (Admin/Staff only)
 * @param {number} id - Bill ID
 * @returns {Promise} API response with bill details
 */
export const getBillById = async (id) => {
  const response = await api.get(`/api/Billing/${id}`);
  return response.data;
};

/**
 * Apply discount to a pending bill (Admin/Staff only)
 * @param {{ BillingId: number, DiscountPercent: number }} data
 * @returns {Promise} API response
 */
export const updateDiscount = async (data) => {
  const response = await api.put('/api/Billing/update-discount', data);
  return response.data;
};

/**
 * Finalize a pending bill (Admin/Staff only)
 * @param {number} id - Bill ID
 * @returns {Promise} API response
 */
export const finalizeBill = async (id) => {
  const response = await api.put(`/api/Billing/finalize/${id}`);
  return response.data;
};

/**
 * Regenerate a pending bill (Admin/Staff only)
 * @param {number} id - Bill ID
 * @returns {Promise} API response
 */
export const regenerateBill = async (id) => {
  const response = await api.put(`/api/Billing/regenerate/${id}`);
  return response.data;
};

// ============================================
// CUSTOMER BILLING APIs
// ============================================

/**
 * Get logged-in customer's finalized bills (Customer only)
 * @returns {Promise} API response with customer's bills
 */
export const getMyBills = async () => {
  const response = await api.get('/api/Billing/my-bills');
  return response.data;
};
