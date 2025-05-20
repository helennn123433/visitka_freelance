import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Image } from "@/interfaces/services/Image";
import axios from "axios";

export const useSearchingStore = defineStore('searchingStore', () => {
  const images = ref<Image[]>([]);
  const searchInput = ref<string>("");

  const filteredImages = computed(() => {
    if (!searchInput.value.trim()) return images.value;

    const searchTerm = searchInput.value.toLowerCase();
    return images.value.filter(image =>
      image.title.toLowerCase().includes(searchTerm));
  });

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      images.value = response.data;
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }};

  return {
    images,
    searchInput,
    filteredImages,
    fetchServices
  };
});