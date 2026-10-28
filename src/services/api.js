import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const api = axios.create({ baseURL: API_BASE_URL });

export const toMediaUrl = (path) => {
  if (!path || /^https?:\/\//i.test(path)) return path;
  if (API_BASE_URL.startsWith('http')) {
    const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
    return new URL(path, backendOrigin).toString();
  }
  return path;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isPublicAuthRequest = /\/auth\/(login|register)(\?|$)/.test(requestUrl);
    if (error.response?.status === 401 && !isPublicAuthRequest) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
