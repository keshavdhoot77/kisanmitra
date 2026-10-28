import api from './api';

export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const updateAdminUser = (id, data) => api.put(`/admin/users/${id}/status`, data);
export const getAdminListings = (params) => api.get('/admin/listings', { params });
export const updateAdminListing = (id, status) => api.put(`/admin/listings/${id}/status`, { status });
