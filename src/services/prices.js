import api from './api';

export const getReferencePrice = (category, location) => api.get('/prices/reference', { params: { category, location } });
export const getDashboardPrices = (location) => api.get('/prices/dashboard', { params: { location } });
