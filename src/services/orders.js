import api from './api';

export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = (params) => api.get('/orders/me', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data);
export const cancelOrder = (id, data) => api.post(`/orders/${id}/cancel`, data);
