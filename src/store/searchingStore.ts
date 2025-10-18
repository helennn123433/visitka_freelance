import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Image } from "@/interfaces/services/Image";
import type { Service } from "@/interfaces/servicesTypes/servicesTypes";
import axios from "axios";

export const useSearchingStore = defineStore('searchingStore', () => {
  const images = ref<Image[]>([]);
  const servicesData = ref<Service[]>([]);
  const searchInput = ref<string>("");
  const isLoading = ref<boolean>(false);

  const filteredImages = computed(() => {
    if (!searchInput.value.trim()) return images.value;

    const searchTerm = searchInput.value.toLowerCase();
    return images.value.filter(image =>
      image.title.toLowerCase().includes(searchTerm));
  });

  const filteredServices = computed(() => {
    if (!searchInput.value.trim()) {
      return servicesData.value.flatMap(service => service.types);
    }
    const searchTerm = searchInput.value.toLowerCase();
    return servicesData.value
      .flatMap(service => service.types)
      .filter(type => 
        type.title.toLowerCase().includes(searchTerm)
      );
  });

const getServicesByType = () => {
  
  if (!servicesData.value || servicesData.value.length === 0) {
    return [];
  }
  
  const firstService = servicesData.value[0];
  
  if (firstService && firstService.types) {
    return firstService.types.map(type => ({
      id: type.id,
      title: type.title,
      image: type.image,
    }));
  }
  
  return [];
};
const fetchServices = async () => {
  try {
    const response = await axios.get('/api/services');
    
    if (response.data && response.data.services) {
      images.value = response.data.services;
    } else if (Array.isArray(response.data)) {
      images.value = response.data;
    } else {
      images.value = [];
    }
    
  } catch (error) {
    console.error('Ошибка загрузки услуг:', error);
  }
};

const fetchServiceTypes = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get('/api/subservices');
    
    if (response.data && Array.isArray(response.data.servicesTypesProjects)) {
      servicesData.value = response.data.servicesTypesProjects;
    } else if (Array.isArray(response.data)) {
      servicesData.value = response.data;
    } else {
      console.warn('Неизвестная структура данных ServiceTypeProject:', response.data);
      servicesData.value = [];
    }
    
  } catch (error) {
    console.error('Ошибка загрузки типов услуг:', error);
    servicesData.value = [];
  } finally {
    isLoading.value = false;
  }
};

  return {
    images,
    servicesData,
    searchInput,
    isLoading,
    filteredImages,
    filteredServices,
    getServicesByType,
    fetchServices,
    fetchServiceTypes
  };
});