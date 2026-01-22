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

  const addService = async (serviceData: Omit<Service, 'id'> & { id?: string }) => {
    return execute(async () => {
      const newService = await servicesApi.createService(serviceData);
      services.value.push(newService);
      return newService;
    }, 'Ошибка при добавлении услуги');
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    return execute(async () => {
      const index = services.value.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error(`Услуга с ID ${id} не найдена`);
      }

      const currentService = services.value[index];
      const updatedService = { ...currentService, ...updates, id };

      services.value[index] = await servicesApi.updateService(id, updatedService);
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
