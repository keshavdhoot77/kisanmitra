import api from './api';

export const createOffer = (data) => api.post('/offers', data);
export const getOffersForListing = (listingId) => api.get(`/offers/listing/${listingId}`);
export const getMyOffers = () => api.get('/offers/me');
export const acceptOffer = (id) => api.post(`/offers/${id}/accept`);
export const rejectOffer = (id) => api.post(`/offers/${id}/reject`);
export const counterOffer = (id, data) => api.post(`/offers/${id}/counter`, data);
export const withdrawOffer = (id) => api.post(`/offers/${id}/withdraw`);
