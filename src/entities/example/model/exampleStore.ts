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
    exampleId: string,
    updates: UpdateExampleRequest,
    oldTypeId: string
  ): Promise<void> => {
    return execute(async () => {
      await examplesApi.updateExample(exampleId, updates);

      if (updates.typeId && updates.typeId !== oldTypeId) {
        removeFromType(oldTypeId, exampleId);
      }
      
      let imagePath: string | undefined;
      
      if (updates.image instanceof Blob) {
        imagePath = URL.createObjectURL(updates.image);
      } else if (typeof updates.image === 'string') {
        imagePath = updates.image;
      }

      upsertToType(updates.typeId || oldTypeId, {
        ...updates,
        id: exampleId,
        image: imagePath
      } as Partial<Example> & { id: string });

    }, 'Не удалось обновить проект');
  };

  function removeFromType(typeId: string, id: string) {
    const project = serviceTypeProjects.value.find(p => p.id === typeId);
    if (project) project.examples = project.examples.filter(e => e.id !== id);
  }

  function upsertToType(typeId: string, data: Partial<Example> & { id: string }) {
    const project = serviceTypeProjects.value.find(p => p.id === typeId);
    if (!project) return;
    
    const idx = project.examples.findIndex(e => e.id === data.id);
    if (idx !== -1) {
      project.examples[idx] = { ...project.examples[idx], ...data };
    } else {
      project.examples.push(data as Example);
    }
  }

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
