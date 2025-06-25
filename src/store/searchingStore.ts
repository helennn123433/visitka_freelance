import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Image } from "@/interfaces/services/Image";
import type { Service } from "@/interfaces/servicesTypes/servicesTypes";
import axios from "axios";

export const useSearchingStore = defineStore('searchingStore', () => {
  const images = ref<Image[]>([]);
  const servicesData = ref<Service[]>([]);
  const searchInput = ref<string>("");
  const isLoading = ref(false);

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

  const getServicesByType = (serviceId: number) => {
    const foundService = servicesData.value.find(
      service => service.id === serviceId
    );
    return foundService 
      ? foundService.types.map(type => ({
          id: type.id,
          title: type.title,
          image: type.image,
        }))
      : [];
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      images.value = response.data;
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      isLoading.value = true;
      const response = await axios.get('/api/servicestypes');
      servicesData.value = response.data || [];
    } catch (error) {
      console.error('Ошибка загрузки типов услуг:', error);
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