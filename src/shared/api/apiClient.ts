import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '@shared/config';

const isDevelopment = process.env.NODE_ENV === 'development';
const ADMIN_BASE_URL = isDevelopment ? 'http://localhost:8080' : '';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

const adminClient: AxiosInstance = axios.create({
  baseURL: ADMIN_BASE_URL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

const setupInterceptors = (client: AxiosInstance) => {
  client.interceptors.request.use(
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

  client.interceptors.response.use(
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
};

setupInterceptors(apiClient);
setupInterceptors(adminClient);

export { apiClient, adminClient };
export default apiClient;
