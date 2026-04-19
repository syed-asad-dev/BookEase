import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
});

// Request interceptor for adding the bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bookease_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
