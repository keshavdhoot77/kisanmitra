import api from './api';

export const createReview = (data) => api.post('/reviews', data);
export const getUserReviews = (userId) => api.get(`/reviews/user/${userId}`);
export const respondToReview = (id, data) => api.post(`/reviews/${id}/respond`, data);
