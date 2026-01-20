import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Subservice, SubserviceType } from './types';
import { subservicesApi } from '../api/subservicesApi';

export const useSubserviceStore = defineStore('subserviceStore', () => {
  const subservices = ref<Subservice[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchSubservices = async () => {
    try {
      error.value = null;
      isLoading.value = true;
      const data = await subservicesApi.getSubservices();
      subservices.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить подуслуги';
      console.error('Ошибка загрузки подуслуг:', err);
      subservices.value = [];
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getSubservicesByServiceId = (serviceId: string): Subservice[] => {
    return subservices.value.filter(subservice =>
      subservice.types?.some(type => type.serviceId === serviceId)
    );
  };

  const getTypesByServiceId = (serviceId: string): SubserviceType[] => {
    const allTypes = subservices.value.flatMap(subservice => subservice.types || []);
    return allTypes.filter(type => type.serviceId === serviceId);
  };

  const getSubserviceIdByTypeId = (typeId: string): string | undefined => {
    for (const subservice of subservices.value) {
      if (subservice.types?.some(t => t.id === typeId)) {
        return subservice.subserviceId;
      }
    }
    return undefined;
  };

  const getSubserviceById = (subserviceId: string): Subservice | undefined => {
    return subservices.value.find(s => s.subserviceId === subserviceId);
  };

  const addSubservice = async (subserviceData: Omit<Subservice, 'subserviceId'> & { subserviceId?: string }): Promise<Subservice> => {
    try {
      error.value = null;
      isLoading.value = true;

      const newSubservice = await subservicesApi.createSubservice(subserviceData);
      subservices.value.push(newSubservice);

      return newSubservice;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось создать подуслугу';
      console.error('Store: Ошибка при создании подуслуги:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSubservice = async (subserviceId: string): Promise<void> => {
    try {
      error.value = null;
      isLoading.value = true;

      await subservicesApi.deleteSubservice(subserviceId);
      subservices.value = subservices.value.filter(s => s.subserviceId !== subserviceId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось удалить подуслугу';
      console.error('Ошибка при удалении подуслуги:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addSubserviceType = async (subserviceId: string, typeData: Omit<SubserviceType, 'id'> & { id?: string }): Promise<SubserviceType> => {
    try {
      error.value = null;
      isLoading.value = true;

      const fullData = {
        title: typeData.title,
        image: typeData.image,
        serviceId: typeData.serviceId
      };

      const updatedSubservice = await subservicesApi.createType(subserviceId, fullData);

      let createdType: SubserviceType;

      if (updatedSubservice.types && updatedSubservice.types.length > 0) {
        createdType = updatedSubservice.types[updatedSubservice.types.length - 1];
      } else {
        createdType = {
          id: 'unknown',
          ...typeData
        };
      }

      const subserviceIndex = subservices.value.findIndex(s => s.subserviceId === subserviceId);
      if (subserviceIndex !== -1) {
        subservices.value[subserviceIndex] = updatedSubservice;
      } else {
        subservices.value.push(updatedSubservice);
      }

      return createdType;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось создать тип подуслуги';
      console.error('Store: Ошибка при создании типа подуслуги:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateSubserviceType = async (typeId: string, updates: Partial<SubserviceType>): Promise<SubserviceType> => {
    try {
      error.value = null;
      isLoading.value = true;

      const subserviceId = getSubserviceIdByTypeId(typeId);
      if (!subserviceId) {
        throw new Error('Не найдена родительская подуслуга');
      }

      const subservice = getSubserviceById(subserviceId);
      if (!subservice) {
        throw new Error('Подуслуга не найдена');
      }

      const currentType = subservice.types?.find(t => t.id === typeId);
      if (!currentType) {
        throw new Error('Тип не найден');
      }

      const updatedType: SubserviceType = {
        id: typeId,
        title: updates.title || currentType.title,
        image: updates.image || currentType.image,
        serviceId: updates.serviceId || currentType.serviceId
      };

      const serverResponse = await subservicesApi.updateType(subserviceId, typeId, updatedType);

      const subserviceIndex = subservices.value.findIndex(s => s.subserviceId === subserviceId);
      if (subserviceIndex !== -1 && subservices.value[subserviceIndex].types) {
        const typeIndex = subservices.value[subserviceIndex].types!.findIndex(t => t.id === typeId);
        if (typeIndex !== -1) {
          subservices.value[subserviceIndex].types![typeIndex] = serverResponse;
        } else {
          subservices.value[subserviceIndex].types!.push(serverResponse);
        }
      }

      return serverResponse;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось обновить тип подуслуги';
      console.error('Store: Ошибка при обновлении типа подуслуги:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSubserviceType = async (subserviceId: string, typeId: string) => {
    try {
      error.value = null;
      isLoading.value = true;

      await subservicesApi.deleteType(subserviceId, typeId);
      await fetchSubservices();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось удалить тип подуслуги';
      console.error('Ошибка при удалении типа подуслуги:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    subservices,
    isLoading,
    error,
    fetchSubservices,
    getSubservicesByServiceId,
    getTypesByServiceId,
    getSubserviceIdByTypeId,
    getSubserviceById,
    addSubservice,
    deleteSubservice,
    addSubserviceType,
    updateSubserviceType,
    deleteSubserviceType,
    clearError,
  };
});
