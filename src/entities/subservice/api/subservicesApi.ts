import { apiClient } from '@shared/api';
import type { Subservice, SubserviceType } from '../model/types';

export const subservicesApi = {
  async getSubservices(): Promise<Subservice[]> {
    try {
      const response = await apiClient.get<Subservice[]>('/subservices');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении подуслуг:', error);
      throw new Error('Не удалось загрузить подуслуги');
    }
  },

  async createSubservice(subserviceData: Omit<Subservice, 'subserviceId'> & { subserviceId?: string }): Promise<Subservice> {
    try {
      const response = await apiClient.post<Subservice>('http://localhost:8080/admin/subservices', {
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
      await apiClient.delete(`http://localhost:8080/admin/subservices/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении подуслуги ${id}:`, error);
      throw new Error('Не удалось удалить подуслугу');
    }
  },

  async createType(subserviceId: string, typeData: Omit<SubserviceType, 'id'>): Promise<Subservice> {
    try {
      const response = await apiClient.post<Subservice>(
        `http://localhost:8080/admin/subservices/${subserviceId}/types`,
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
      console.log(`Обновление типа ${typeId} в подуслуге ${subserviceId}:`, typeData);

      const response = await apiClient.put<SubserviceType>(
        `http://localhost:8080/admin/subservices/${subserviceId}/types/${typeId}`,
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
      await apiClient.delete(`http://localhost:8080/admin/subservices/${subserviceId}/types/${typeId}`);
    } catch (error) {
      console.error(`Ошибка при удалении типа ${typeId} из подуслуги ${subserviceId}:`, error);
      throw new Error('Не удалось удалить тип услуги');
    }
  },
};
