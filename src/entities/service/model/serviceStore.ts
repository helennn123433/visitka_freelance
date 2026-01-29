import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Service} from './types';
import {servicesApi} from '../api/servicesApi';
import {useAsyncState} from '@shared/lib';

export const useServiceStore = defineStore('serviceStore', () => {
  const services = ref<Service[]>([]);
  const { isLoading, error, execute, clearError } = useAsyncState<Service[]>([]);

  const fetchServices = async () => {
    await execute(async () => {
      const data = await servicesApi.getServices();
      services.value = data;
      return data;
    }, 'Не удалось загрузить услуги');
  };

  const getServiceById = (id: string): Service | undefined => {
    return services.value.find(service => service.id === id);
  };

  const addService = async ({
  formData,
  params,
  }: {
    formData: FormData;
    params: { title: string; price: number };
  }) => {
    return execute(async () => {
      const newService = await servicesApi.createService(formData, params);
      services.value.push(newService);
      return newService;
    }, 'Ошибка при добавлении услуги');
  };

  const updateService = async ({id, params, formData }: {
    id: string;
    params: { title: string; price: number };
    formData: FormData;
  }) => {
    return execute(async () => {
      const index = services.value.findIndex(s => s.id === id);

      if (index === -1) {
        throw new Error(`Услуга с ID ${id} не найдена`);
      }

      const updatedService = await servicesApi.updateService(
        id,
        params,
        formData
      );

      services.value[index] = updatedService;
      return updatedService;
    }, 'Ошибка при обновлении услуги');
  };

  const deleteService = async (id: string) => {
    return execute(async () => {
      await servicesApi.deleteService(id);
      services.value = services.value.filter(s => s.id !== id);
    }, 'Ошибка при удалении услуги');
  };

  return {
    services,
    isLoading,
    error,
    fetchServices,
    getServiceById,
    addService,
    updateService,
    deleteService,
    clearError,
  };
});
