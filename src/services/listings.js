import api from './api';

export const getListings = (params) => api.get('/listings', { params });
export const getListing = (id) => api.get(`/listings/${id}`);
export const createListing = (data) => api.post('/listings', data);
export const updateListing = (id, data) => api.put(`/listings/${id}`, data);
export const deleteListing = (id) => api.delete(`/listings/${id}`);
export const getMyListings = () => api.get('/listings/me');
export const getSimilarListings = (id) => api.get(`/listings/${id}/similar`);

export const uploadImages = (formData) => api.post('/upload/images', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const uploadVideo = (formData) => api.post('/upload/video', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
