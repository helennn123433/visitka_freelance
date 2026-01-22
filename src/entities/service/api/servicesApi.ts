import { apiClient, adminClient } from '@shared/api';
import { API_CONFIG } from '@shared/config';
import type { Service } from '../model/types';

const { endpoints } = API_CONFIG;

export const servicesApi = {
  async getServices(): Promise<Service[]> {
    try {
      const response = await apiClient.get<Service[]>(endpoints.services);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении услуг:', error);
      throw error;
    }
  },

  async createService(serviceData: Omit<Service, 'id'> & { id?: string }): Promise<Service> {
    try {
      const response = await adminClient.post<Service>(endpoints.admin.services, serviceData);
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

      const response = await adminClient.put<Service>(
        `${endpoints.admin.services}/${id}`,
        updatedService
      );
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
      await adminClient.delete(`${endpoints.admin.services}/${id}`);
    } catch (error) {
      console.error('Ошибка при удалении услуги:', error);
      throw error;
    }
  },
};
