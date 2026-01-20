import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useServiceStore } from '@entities/service';

export const useSearchStore = defineStore('searchStore', () => {
  const searchInput = ref<string>('');

  const filteredServices = computed(() => {
    const serviceStore = useServiceStore();
    if (!searchInput.value.trim()) return serviceStore.services;
    const searchTerm = searchInput.value.toLowerCase();
    return serviceStore.services.filter(service =>
      service.title.toLowerCase().includes(searchTerm)
    );
  });

  const clearSearch = () => {
    searchInput.value = '';
  };

  return {
    searchInput,
    filteredServices,
    clearSearch,
  };
});
