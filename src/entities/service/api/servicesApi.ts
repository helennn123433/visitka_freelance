import { apiClient, adminClient } from '@shared/api';
import { API_CONFIG } from '@shared/config';
import type { Service } from '../model/types';

const { endpoints } = API_CONFIG;

export const servicesApi = {
  async getServices(): Promise<Service[]> {
    const response = await apiClient.get<Service[]>(endpoints.services);
    return response.data;
  },

  async createService(
    formData: FormData,
    params: { title: string; price: number }
  ): Promise<Service> {
    const response = await adminClient.post<Service>(
      endpoints.admin.services,
      formData,
      {
        params,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  async updateService(id: string, params: { title: string; price: number },
    formData: FormData
  ): Promise<Service> {
    const response = await adminClient.put<Service>(`${endpoints.admin.services}/${id}`, formData,
      {
        params,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  async deleteService(id: string): Promise<void> {
    await adminClient.delete(`${endpoints.admin.services}/${id}`);
  },
};
