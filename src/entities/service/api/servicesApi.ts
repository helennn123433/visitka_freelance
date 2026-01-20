import { apiClient } from '@shared/api';
import type { Service } from '../model/types';

export const servicesApi = {
  async getServices(): Promise<Service[]> {
    try {
      const response = await apiClient.get<Service[]>('/services');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении услуг:', error);
      throw error;
    }
  },

  async createService(serviceData: Omit<Service, 'id'> & { id?: string }): Promise<Service> {
    try {
      const response = await apiClient.post<Service>('http://localhost:8080/admin/services', serviceData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании услуги:', error);
      throw error;
    }
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    try {
      const currentService = await this.getServiceById(id);
      const updatedService = {
        ...currentService,
        ...updates,
        id
      };

      const response = await apiClient.put<Service>(`http://localhost:8080/admin/services/${id}`, updatedService);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении услуги ${id}:`, error);
      throw error;
    }
  },

  async getServiceById(id: string): Promise<Service> {
    try {
      const services = await this.getServices();
      const service = services.find(s => s.id === id);

      if (!service) {
        throw new Error(`Услуга с ID ${id} не найдена`);
      }

      return service;
    } catch (error) {
      console.error(`Ошибка при получении услуги ${id}:`, error);
      throw error;
    }
  },

  async deleteService(id: string): Promise<void> {
    try {
      await apiClient.delete(`http://localhost:8080/admin/services/${id}`);
    } catch (error) {
      console.error('Ошибка при удалении услуги:', error);
      throw error;
    }
  },
};
