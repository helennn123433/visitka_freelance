<template>
  <div class="servicePage">
    <div class="header">
      <div>{{ title.toUpperCase() }}</div>
    </div>
    <div class="content">
      <div class="cards-field">
        <div 
          v-if="services.length > 0" 
          class="cards-grid"
        >
          <CardComp 
            v-for="service in services" 
            :key="service.id" 
            :image="service"
            :show-price="false"
            @updated="fetchServices"
          />
        </div>
        <div v-else>
          <p v-if="isLoading">
            Загрузка...
          </p>
          <p v-else>
            Услуги не найдены
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import CardComp from '@/components/services/CardComp.vue';
import type { Service, ServiceType } from '@/interfaces/servicesTypes/servicesTypes';

const route = useRoute();
const title = route.query.title as string;
const serviceId = ref(Number(route.params.id));
const isLoading = ref(true);

const servicesData = ref<Service[]>([]);
const currentServiceType = ref<ServiceType | null>(null);
const services = ref<Array<{id: number; title: string; image: string}>>([]);

const fetchServices = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get('/api/servicestypes');
    servicesData.value = response.data || [];
    
    const foundService = servicesData.value.find(
      service => service.id === serviceId.value
    );
    
    if (foundService) {
      services.value = foundService.types.map(type => ({
        id: type.id,
        title: type.title,
        image: type.image,
      }));
      
      currentServiceType.value = foundService.types[0] || null;
    } else {
      services.value = [];
      currentServiceType.value = null;
    }
  } catch (error) {
    console.error('Ошибка:', error);
    services.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(() => route.params.id, (newId) => {
  serviceId.value = Number(newId);
  fetchServices();
}, { immediate: true });

onMounted(() => {
  fetchServices();
});
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.card {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.servicePage {
  display: flex;
  flex-direction: column;
  background-color: $white;
  padding: 1.5vw;
  width: 100%;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-self: flex-start;
  line-height: 100%;
  width: 100%;
  color: #0652ff;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 800;
  padding-bottom: 16px;
}

.content {
  width: 100%;
}

.cards-field {
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
  width: 100%;
}

.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5vw;
  justify-content: center;
  width: 100%;
}

@media (max-width: 767px) {
  .cards-grid {
    gap: 0;
    flex-direction: column;
    align-items: center;
  }
  
  .servicePage {
    padding: 1rem;
  }
}

@media (max-width: 450px) {
  .header {
    flex-direction: column;
    gap: 3vw;
    margin-bottom: 3vw;
  }
}
</style>