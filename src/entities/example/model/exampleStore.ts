import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ServiceTypeProject, Example, AddExampleRequest, UpdateExampleRequest } from './types';
import { examplesApi } from '../api/examplesApi';
import { useAsyncState } from '@shared/lib';

export const useExampleStore = defineStore('exampleStore', () => {
  const serviceTypeProjects = ref<ServiceTypeProject[]>([]);
  const { isLoading, error, execute, clearError } = useAsyncState<ServiceTypeProject[]>([]);

  const fetchServiceTypeProjects = async () => {
    await execute(async () => {
      const projects = await examplesApi.getServiceTypeProjects();
      serviceTypeProjects.value = projects;
      return projects;
    }, 'Не удалось загрузить проекты');
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
    return execute(async () => {
      await fetchServiceTypeProjects();
      return getExamplesByTypeId(typeId);
    }, 'Не удалось загрузить примеры');
  };

  const addExample = async (exampleData: AddExampleRequest): Promise<Example> => {
    return execute(async () => {
      const response = await examplesApi.addExample(exampleData);
      await fetchServiceTypeProjects();
      return response;
    }, 'Не удалось добавить пример работы');
  };

  const updateExample = async (
    oldTypeId: string,
    exampleId: string,
    updates: UpdateExampleRequest
  ): Promise<Example> => {
    return execute(async () => {
      const updateData = {
        typeId: updates.typeId,
        image: updates.image
      };

      await examplesApi.updateExample(exampleId, updateData);

      if (updates.typeId !== oldTypeId) {
        const oldProjectIndex = serviceTypeProjects.value.findIndex(p => p.id === oldTypeId);
        if (oldProjectIndex !== -1) {
          serviceTypeProjects.value[oldProjectIndex].examples =
            serviceTypeProjects.value[oldProjectIndex].examples.filter(e => e.id !== exampleId);
        }
      }

      const newProjectIndex = serviceTypeProjects.value.findIndex(p => p.id === updates.typeId);
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

      return { id: exampleId, typeId: updates.typeId, image: updates.image };
    }, 'Не удалось обновить пример');
  };

  const deleteExample = async (typeId: string, exampleId: string): Promise<void> => {
    return execute(async () => {
      await examplesApi.deleteExample(exampleId);

      const projectIndex = serviceTypeProjects.value.findIndex(p =>
        p.id === typeId || p.examples.some(e => e.id === exampleId)
      );

      if (projectIndex !== -1) {
        serviceTypeProjects.value[projectIndex].examples =
          serviceTypeProjects.value[projectIndex].examples.filter(e => e.id !== exampleId);
      }
    }, 'Не удалось удалить пример');
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
