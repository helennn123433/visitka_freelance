import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Subservice, SubserviceType } from './types';
import { subservicesApi } from '../api/subservicesApi';
import { useAsyncState } from '@shared/lib';

export const useSubserviceStore = defineStore('subserviceStore', () => {
  const subservices = ref<Subservice[]>([]);
  const { isLoading, error, execute, clearError } = useAsyncState<Subservice[]>([]);

  const fetchSubservices = async () => {
    await execute(async () => {
      const data = await subservicesApi.getSubservices();
      subservices.value = data;
      return data;
    }, 'Не удалось загрузить подуслуги');
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
    return execute(async () => {
      const newSubservice = await subservicesApi.createSubservice(subserviceData);
      subservices.value.push(newSubservice);
      return newSubservice;
    }, 'Не удалось создать подуслугу');
  };

  const deleteSubservice = async (subserviceId: string): Promise<void> => {
    return execute(async () => {
      await subservicesApi.deleteSubservice(subserviceId);
      subservices.value = subservices.value.filter(s => s.subserviceId !== subserviceId);
    }, 'Не удалось удалить подуслугу');
  };

  const addSubserviceType = async (subserviceId: string, typeData: Omit<SubserviceType, 'id'> & { id?: string }): Promise<SubserviceType> => {
    return execute(async () => {
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
        createdType = { id: 'unknown', ...typeData };
      }

      const subserviceIndex = subservices.value.findIndex(s => s.subserviceId === subserviceId);
      if (subserviceIndex !== -1) {
        subservices.value[subserviceIndex] = updatedSubservice;
      } else {
        subservices.value.push(updatedSubservice);
      }

      return createdType;
    }, 'Не удалось создать тип подуслуги');
  };

  const updateSubserviceType = async (typeId: string, updates: Partial<SubserviceType>): Promise<SubserviceType> => {
    return execute(async () => {
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
      const types = subservices.value[subserviceIndex]?.types;
      if (subserviceIndex !== -1 && types) {
        const typeIndex = types.findIndex(t => t.id === typeId);
        if (typeIndex !== -1) {
          types[typeIndex] = serverResponse;
        } else {
          types.push(serverResponse);
        }
      }

      return serverResponse;
    }, 'Не удалось обновить тип подуслуги');
  };

  const deleteSubserviceType = async (subserviceId: string, typeId: string) => {
    return execute(async () => {
      await subservicesApi.deleteType(subserviceId, typeId);
      await fetchSubservices();
    }, 'Не удалось удалить тип подуслуги');
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
