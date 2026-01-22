import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { API_CONFIG } from '@shared/config';

const isDevelopment = process.env.NODE_ENV === 'development';
const ADMIN_BASE_URL = isDevelopment ? 'http://localhost:8080' : '';

const createApiClient = (config: CreateAxiosDefaults): AxiosInstance => {
  const client = axios.create({
    timeout: API_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false,
    ...config,
  });

  client.interceptors.request.use(
    (requestConfig) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
      return requestConfig;
    },
    (error) => Promise.reject(error)
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

  return client;
};

const apiClient = createApiClient({ baseURL: API_CONFIG.baseUrl });
const adminClient = createApiClient({ baseURL: ADMIN_BASE_URL });

export { apiClient, adminClient };
export default apiClient;
