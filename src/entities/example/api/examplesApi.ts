import { apiClient } from '@shared/api';
import type { Example, ServiceTypeProject, AddExampleRequest } from '../model/types';

export const examplesApi = {
  async getServiceTypeProjects(): Promise<ServiceTypeProject[]> {
    try {
      const response = await apiClient.get<ServiceTypeProject[]>('/services-types-projects');
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

      return allExamples;
    } catch (error) {
      console.error(`Ошибка при получении примеров для типа ${typeId}:`, error);
      throw new Error('Не удалось загрузить примеры');
    }
  },

  async addExample(exampleData: AddExampleRequest): Promise<Example> {
    try {
      const response = await apiClient.post<Example>(
        'http://localhost:8080/admin/type-projects',
        {
          typeId: exampleData.typeId,
          image: exampleData.image
        }
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при добавлении примера:', error);
      throw new Error('Не удалось добавить пример работы');
    }
  },

  async updateExample(exampleId: string, updateData: { typeId: string; image: string }): Promise<void> {
    try {
      await apiClient.put(
        `http://localhost:8080/admin/type-projects/${exampleId}`,
        {
          typeId: updateData.typeId,
          image: updateData.image
        }
      );
    } catch (error) {
      console.error('Ошибка при обновлении примера:', error);
      throw new Error('Не удалось обновить пример работы');
    }
  },

  async deleteExample(exampleId: string): Promise<void> {
    try {
      await apiClient.delete(
        `http://localhost:8080/admin/type-projects/${exampleId}`
      );
    } catch (error) {
      console.error('Ошибка при удалении примера:', error);
      throw new Error('Не удалось удалить пример работы');
    }
  },
};
