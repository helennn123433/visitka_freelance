import { apiClient, adminClient } from '@shared/api';
import { API_CONFIG } from '@shared/config';
import type { Subservice, SubserviceType } from '../model/types';

const { endpoints } = API_CONFIG;

export const subservicesApi = {
  async getSubservices(): Promise<Subservice[]> {
    try {
      const response = await apiClient.get<Subservice[]>(endpoints.subservices);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении подуслуг:', error);
      throw new Error('Не удалось загрузить подуслуги');
    }
  },

  async createSubservice(subserviceData: Omit<Subservice, 'subserviceId'> & { subserviceId?: string }): Promise<Subservice> {
    try {
      const response = await adminClient.post<Subservice>(endpoints.admin.subservices, {
        ...subserviceData,
        types: subserviceData.types || []
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании подуслуги:', error);
      throw new Error('Не удалось создать подуслугу');
    }
  },

  async deleteSubservice(id: string): Promise<void> {
    try {
      await adminClient.delete(`${endpoints.admin.subservices}/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении подуслуги ${id}:`, error);
      throw new Error('Не удалось удалить подуслугу');
    }
  },

  async createType(subserviceId: string, typeData: Omit<SubserviceType, 'id'>): Promise<Subservice> {
    try {
      const response = await adminClient.post<Subservice>(
        `${endpoints.admin.subservices}/${subserviceId}/types`,
        {
          title: typeData.title,
          image: typeData.image,
          serviceId: typeData.serviceId
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Ошибка при создании типа в подуслуге ${subserviceId}:`, error);
      throw new Error('Не удалось создать тип');
    }
  },

  async updateType(subserviceId: string, typeId: string, typeData: SubserviceType): Promise<SubserviceType> {
    try {
      const response = await adminClient.put<SubserviceType>(
        `${endpoints.admin.subservices}/${subserviceId}/types/${typeId}`,
        {
          id: typeId,
          title: typeData.title,
          image: typeData.image,
          serviceId: typeData.serviceId
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении типа ${typeId} в подуслуге ${subserviceId}:`, error);
      throw new Error('Не удалось обновить тип');
    }
  },

  async deleteType(subserviceId: string, typeId: string): Promise<void> {
    try {
      await adminClient.delete(`${endpoints.admin.subservices}/${subserviceId}/types/${typeId}`);
    } catch (error) {
      console.error(`Ошибка при удалении типа ${typeId} из подуслуги ${subserviceId}:`, error);
      throw new Error('Не удалось удалить тип услуги');
    }
  },
};
