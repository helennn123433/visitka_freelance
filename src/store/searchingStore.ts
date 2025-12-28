// store/searchingStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Image } from "@/interfaces/services/Image";
import type { Service } from "@/interfaces/services/Service";
import { servicesApi } from '@/connectionServices/services';
import { subservicesApi } from '@/connectionServices/subservices';
import { serviceTypeProjectsApi } from '@/connectionServices/serviceTypeProjects';
import type { Subservice, SubserviceType } from "@/interfaces/services/Subservices";
import type { ServiceTypeProject, Example, AddExampleRequest, UpdateExampleRequest } from '@/interfaces/services/ServiceTypeProject';

export const useSearchingStore = defineStore('searchingStore', () => {
  const images = ref<Image[]>([]);
  const servicesData = ref<Service[]>([]);
  const subservicesData = ref<Subservice[]>([]);
  const serviceTypeProjects = ref<ServiceTypeProject[]>([]);
  const searchInput = ref<string>("");
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const filteredImages = computed(() => {
    if (!searchInput.value.trim()) return images.value;
    const searchTerm = searchInput.value.toLowerCase();
    return images.value.filter(image =>
      image.title.toLowerCase().includes(searchTerm));
  });

  const filteredServices = computed(() => {
    return subservicesData.value.flatMap(subservice => subservice.types || []);
  });

  const getSubservicesByServiceId = (serviceId: string): Subservice[] => {
    return subservicesData.value.filter(subservice => 
      subservice.types?.some(type => type.serviceId === serviceId)
    );
  };

  const getTypesByServiceId = (serviceId: string): SubserviceType[] => {
    const allTypes = subservicesData.value.flatMap(subservice => subservice.types || []);
    return allTypes.filter(type => type.serviceId === serviceId);
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

  const getServicesByType = () => {
    if (!subservicesData.value || subservicesData.value.length === 0) {
      return [];
    }
    
    const allTypes = subservicesData.value.flatMap(subservice => subservice.types || []);
    
    if (allTypes.length > 0) {
      return allTypes.map(type => ({
        id: type.id,
        title: type.title,
        image: type.image,
      }));
    }
    
    return [];
  };

  const getServiceById = (id: string): Image | undefined => {
    return images.value.find(service => service.id === id);
  };

  const getSubserviceIdByTypeId = (typeId: string): string | undefined => {
    for (const subservice of subservicesData.value) {
      if (subservice.types?.some(t => t.id === typeId)) {
        return subservice.subserviceId;
      }
    }
    return undefined;
  };

  const getSubserviceById = (subserviceId: string): Subservice | undefined => {
    return subservicesData.value.find(s => s.subserviceId === subserviceId);
  };

  const addService = async (serviceData: Omit<Image, 'id'> & { id?: string }) => {
    try {
      const newService = await servicesApi.createService(serviceData);
      images.value.push(newService);
      return newService;
    } catch (error) {
      console.error('Ошибка при добавлении услуги:', error);
      throw error;
    }
  };

  const addExample = async (exampleData: AddExampleRequest): Promise<Example> => {
    try {
      error.value = null;
      isLoading.value = true;
      const response = await serviceTypeProjectsApi.addExample(exampleData);
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

  const addSubservice = async (subserviceData: Omit<Subservice, 'subserviceId'> & { subserviceId?: string }): Promise<Subservice> => {
    try {
      error.value = null;
      isLoading.value = true;
      
      const dataToSend = {
        ...subserviceData,
      };
      
      const newSubservice = await subservicesApi.createSubservice(dataToSend);
      
      subservicesData.value.push(newSubservice);
      
      return newSubservice;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось создать подуслугу';
      console.error('Store: Ошибка при создании подуслуги:', err);
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
      
      const subserviceIndex = subservicesData.value.findIndex(s => s.subserviceId === subserviceId);
      if (subserviceIndex !== -1) {
        subservicesData.value[subserviceIndex] = updatedSubservice;
      } else {
        subservicesData.value.push(updatedSubservice);
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
  
  const fetchServices = async () => {
    try {
      error.value = null;
      isLoading.value = true;
      const services = await servicesApi.getServices();
      images.value = services;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить услуги';
      console.error('Ошибка загрузки услуг:', err);
      images.value = [];
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchSubservices = async () => {
    try {
      error.value = null;
      isLoading.value = true;
      const subservices = await subservicesApi.getSubservices();
      subservicesData.value = subservices;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить подуслуги';
      console.error('Ошибка загрузки подуслуг:', err);
      subservicesData.value = [];
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchServiceTypeProjects = async () => {
    try {
      error.value = null;
      isLoading.value = true;
      const projects = await serviceTypeProjectsApi.getServiceTypeProjects();
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
  
  const clearError = () => {
    error.value = null;
  };

  const updateService = async (id: string, updates: Partial<Image>) => {
    try {
      await servicesApi.updateService(id, updates);
      
      const index = images.value.findIndex(img => img.id === id);
      if (index !== -1) {
        images.value[index] = { ...images.value[index], ...updates };
      }
    } catch (error) {
      console.error('Ошибка при обновлении услуги:', error);
      throw error;
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

      await serviceTypeProjectsApi.updateExample(exampleId, updateData);
      
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
      
      const subserviceIndex = subservicesData.value.findIndex(s => s.subserviceId === subserviceId);
      if (subserviceIndex !== -1 && subservicesData.value[subserviceIndex].types) {
        const typeIndex = subservicesData.value[subserviceIndex].types!.findIndex(t => t.id === typeId);
        if (typeIndex !== -1) {
          subservicesData.value[subserviceIndex].types![typeIndex] = serverResponse;
        } else {
          subservicesData.value[subserviceIndex].types!.push(serverResponse);
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

  const deleteService = async (id: string) => {
    try {
      await servicesApi.deleteService(id);
      images.value = images.value.filter(img => img.id !== id);
    } catch (error) {
      console.error('Ошибка при удалении услуги:', error);
      throw error;
    }
  };

  const deleteExample = async (typeId: string, exampleId: string): Promise<void> => {
    try {
      error.value = null;
      isLoading.value = true;
      
      await serviceTypeProjectsApi.deleteExample(exampleId);
      
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

  
  const deleteSubservice = async (subserviceId: string): Promise<void> => {
    try {
      error.value = null;
      isLoading.value = true;
      
      await subservicesApi.deleteSubservice(subserviceId);
      subservicesData.value = subservicesData.value.filter(s => s.subserviceId !== subserviceId);
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось удалить подуслугу';
      console.error('Ошибка при удалении подуслуги:', err);
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

  return {
    images,
    subservicesData,
    serviceTypeProjects,
    servicesData,
    searchInput,
    isLoading,
    error,

    filteredImages,
    filteredServices,
    getSubservicesByServiceId,
    getServicesByType,

    getServiceById,
    getSubserviceById,
    getExamplesByTypeId,

    addSubservice,          
    deleteSubservice,       
    addSubserviceType,      
    deleteSubserviceType,   
    updateSubserviceType,

    fetchServices,
    fetchSubservices,
    fetchServiceTypeProjects,
    fetchExamplesByTypeId,

    clearError,
    getSubserviceIdByTypeId,
    getTypesByServiceId,
    
    addService,        
    updateService,     
    deleteService,
    addExample,
    updateExample,
    deleteExample,
  };
});