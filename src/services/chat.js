import api from './api';

export const getConversations = () => api.get('/chat/conversations');
export const getMessages = (conversationId, params) => api.get(`/chat/conversations/${conversationId}/messages`, { params });
export const sendMessage = (data) => api.post('/chat/messages', data);
export const markAsRead = (messageId) => api.put(`/chat/messages/${messageId}/read`);
