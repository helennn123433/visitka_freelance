import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ServiceTypeProject, Example, AddExampleRequest, UpdateExampleRequest } from './types';
import { examplesApi } from '../api/examplesApi';

export const useExampleStore = defineStore('exampleStore', () => {
  const serviceTypeProjects = ref<ServiceTypeProject[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchServiceTypeProjects = async () => {
    try {
      error.value = null;
      isLoading.value = true;
      const projects = await examplesApi.getServiceTypeProjects();
      serviceTypeProjects.value = projects;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить проекты';
      console.error('Ошибка загрузки проектов:', err);
      serviceTypeProjects.value = [];
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getExamplesByTypeId = (typeId: string): Example[] => {
    if (serviceTypeProjects.value.length === 0) return [];

    const allExamples: Example[] = [];
    serviceTypeProjects.value.forEach((project) => {
      const matchingExamples = project.examples.filter(example => example.typeId === typeId);
      if (matchingExamples.length > 0) {
        allExamples.push(...matchingExamples);
      }
    });

    return allExamples;
  };

  const fetchExamplesByTypeId = async (typeId: string): Promise<Example[]> => {
    try {
      error.value = null;
      isLoading.value = true;

      await fetchServiceTypeProjects();

      const examples = getExamplesByTypeId(typeId);

      return examples;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить примеры';
      console.error(`Ошибка загрузки примеров для типа ${typeId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addExample = async (exampleData: AddExampleRequest): Promise<Example> => {
    try {
      error.value = null;
      isLoading.value = true;
      const response = await examplesApi.addExample(exampleData);
      await fetchServiceTypeProjects();
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось добавить пример работы';
      console.error('Store: Ошибка при добавлении примера:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateExample = async (
    oldTypeId: string,
    exampleId: string,
    updates: UpdateExampleRequest
  ): Promise<Example> => {
    try {
      error.value = null;
      isLoading.value = true;

      const updateData = {
        typeId: updates.typeId,
        image: updates.image
      };

      await examplesApi.updateExample(exampleId, updateData);

      if (updates.typeId !== oldTypeId) {
        const oldProjectIndex = serviceTypeProjects.value.findIndex(p =>
          p.id === oldTypeId
        );

        if (oldProjectIndex !== -1) {
          serviceTypeProjects.value[oldProjectIndex].examples =
            serviceTypeProjects.value[oldProjectIndex].examples.filter(e => e.id !== exampleId);
        }
      }

      const newProjectIndex = serviceTypeProjects.value.findIndex(p =>
        p.id === updates.typeId
      );

      if (newProjectIndex !== -1) {
        const exampleIndex = serviceTypeProjects.value[newProjectIndex].examples
          .findIndex(e => e.id === exampleId);

        if (exampleIndex !== -1) {
          serviceTypeProjects.value[newProjectIndex].examples[exampleIndex] = {
            ...serviceTypeProjects.value[newProjectIndex].examples[exampleIndex],
            ...updates
          };
        } else {
          serviceTypeProjects.value[newProjectIndex].examples.push({
            id: exampleId,
            typeId: updates.typeId,
            image: updates.image
          });
        }
      }

      return {
        id: exampleId,
        typeId: updates.typeId,
        image: updates.image
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось обновить пример';
      console.error('Store: Ошибка при обновлении примера:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteExample = async (typeId: string, exampleId: string): Promise<void> => {
    try {
      error.value = null;
      isLoading.value = true;

      await examplesApi.deleteExample(exampleId);

      const projectIndex = serviceTypeProjects.value.findIndex(p =>
        p.id === typeId || p.examples.some(e => e.id === exampleId)
      );

      if (projectIndex !== -1) {
        serviceTypeProjects.value[projectIndex].examples =
          serviceTypeProjects.value[projectIndex].examples.filter(e => e.id !== exampleId);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось удалить пример';
      console.error('Store: Ошибка при удалении примера:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    serviceTypeProjects,
    isLoading,
    error,
    fetchServiceTypeProjects,
    getExamplesByTypeId,
    fetchExamplesByTypeId,
    addExample,
    updateExample,
    deleteExample,
    clearError,
  };
});
