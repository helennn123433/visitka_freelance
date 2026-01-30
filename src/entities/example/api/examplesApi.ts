import { apiClient, adminClient } from '@shared/api';
import { API_CONFIG } from '@shared/config';
import type { Example, ServiceTypeProject, AddExampleRequest } from '../model/types';

const { endpoints } = API_CONFIG;

export const examplesApi = {
  async getServiceTypeProjects(): Promise<ServiceTypeProject[]> {
    try {
      const response = await apiClient.get<ServiceTypeProject[]>(endpoints.serviceTypeProjects);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении проектов:', error);
      throw new Error('Не удалось загрузить проекты');
    }
  },

  async getExamplesByTypeId(typeId: string): Promise<Example[]> {
    try {
      const projects = await this.getServiceTypeProjects();

      const allExamples: Example[] = [];

      projects.forEach(project => {
        const matchingExamples = project.examples.filter(example => example.typeId === typeId);
        allExamples.push(...matchingExamples);
      });
      console.log('Полученные примеры:', allExamples);
      return allExamples;
    } catch (error) {
      console.error(`Ошибка при получении примеров для типа ${typeId}:`, error);
      throw new Error('Не удалось загрузить примеры');
    }
  },

  async addExample(exampleData: AddExampleRequest): Promise<Example> {
    try {
    const formData = new FormData();
    formData.append('image', exampleData.image);

    const response = await adminClient.post<Example>(
      endpoints.admin.typeProjects,
      formData,
      {
        params: {
          typeId: exampleData.typeId,
          title: exampleData.title,
          description: exampleData.description,
          price: exampleData.price
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
      console.error('Ошибка при добавлении примера:', error);
      throw new Error('Не удалось добавить пример работы');
    }
  },

  async updateExample(exampleId: string, updateData: any): Promise<void> {
  const formData = new FormData();
  if (updateData.image) {
    formData.append('image', updateData.image);
  }

  await adminClient.put(`${endpoints.admin.typeProjects}/${exampleId}`,formData,
      {
        params: {
          typeId: updateData.typeId,
          title: updateData.title,
          description: updateData.description,
          price: updateData.price
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  },

  async deleteExample(exampleId: string): Promise<void> {
    try {
      await adminClient.delete(`${endpoints.admin.typeProjects}/${exampleId}`);
    } catch (error) {
      console.error('Ошибка при удалении примера:', error);
      throw new Error('Не удалось удалить пример работы');
    }
  },
};
