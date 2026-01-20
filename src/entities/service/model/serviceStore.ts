import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Service } from './types';
import { servicesApi } from '../api/servicesApi';

export const useServiceStore = defineStore('serviceStore', () => {
  const services = ref<Service[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchServices = async () => {
    try {
      error.value = null;
      isLoading.value = true;
      const data = await servicesApi.getServices();
      services.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить услуги';
      console.error('Ошибка загрузки услуг:', err);
      services.value = [];
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getServiceById = (id: string): Service | undefined => {
    return services.value.find(service => service.id === id);
  };

  const addService = async (serviceData: Omit<Service, 'id'> & { id?: string }) => {
    try {
      const newService = await servicesApi.createService(serviceData);
      services.value.push(newService);
      return newService;
    } catch (err) {
      console.error('Ошибка при добавлении услуги:', err);
      throw err;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      await servicesApi.updateService(id, updates);

      const index = services.value.findIndex(s => s.id === id);
      if (index !== -1) {
        services.value[index] = { ...services.value[index], ...updates };
      }
    } catch (err) {
      console.error('Ошибка при обновлении услуги:', err);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await servicesApi.deleteService(id);
      services.value = services.value.filter(s => s.id !== id);
    } catch (err) {
      console.error('Ошибка при удалении услуги:', err);
      throw err;
    }
  };

  const clearError = () => {
    error.value = null;
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
