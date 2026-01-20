import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/api'
  : '/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      console.error('Доступ запрещен. Проверьте CORS настройки сервера.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
