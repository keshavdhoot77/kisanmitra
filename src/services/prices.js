import api from './api';

export const getReferencePrice = (category, location, unit, commodity) => api.get('/prices/reference', { params: { category, location, unit, commodity } });
export const getDashboardPrices = (location) => api.get('/prices/dashboard', { params: { location } });
