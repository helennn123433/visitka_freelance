import { apiClient, adminClient } from '@shared/api';
import { API_CONFIG } from '@shared/config';
import type { Service } from '../model/types';

const { endpoints } = API_CONFIG;

export const servicesApi = {
  async getServices(): Promise<Service[]> {
    const response = await apiClient.get<Service[]>(endpoints.services);
    return response.data;
  },

  async createService(serviceData: Omit<Service, 'id'> & { id?: string }): Promise<Service> {
    const response = await adminClient.post<Service>(endpoints.admin.services, serviceData);
    return response.data;
  },

  async updateService(id: string, updatedService: Service): Promise<Service> {
    const response = await adminClient.put<Service>(
      `${endpoints.admin.services}/${id}`,
      updatedService
    );
    return response.data;
  },

  async deleteService(id: string): Promise<void> {
    await adminClient.delete(`${endpoints.admin.services}/${id}`);
  },
};
