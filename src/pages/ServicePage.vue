<template>
  <div class="servicePage">
    <div class="breadCrumps">
      <router-link 
        to="/" 
        class="breadCrumps__services"
      >
        УСЛУГИ
      </router-link>
      <div class="breadCrumps__separator">
        »
      </div>
      <div class="breadCrumps__serviceType">
        {{ title.toUpperCase() }}
      </div>
    </div>
    <MyHeader class="header">
      <span>{{ title.toUpperCase() }}</span>
    </MyHeader>
    <div class="content">
      <div class="cards-field">
        <div 
          v-if="services.length > 0" 
          class="cards-grid"
        >
          <CardComp 
            v-for="service in displayedServices" 
            :key="service.id" 
            :image="service"
            :show-price="false"
            @click="goToServiceType(service)"
          />
        </div>
        <div v-else>
          <p v-if="searchStore.isLoading">
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchingStore } from '@/store/searchingStore';
import type { ServiceType } from '@/interfaces/servicesTypes/servicesTypes';
import CardComp from '@/components/services/CardComp.vue';
import MyHeader from '@/components/ui/MyHeader.vue';

const route = useRoute();
const router = useRouter();
const title = route.query.title as string;
const serviceId = ref<number>(Number(route.params.id));
const searchStore = useSearchingStore();

const services = computed(() => searchStore.getServicesByType(serviceId.value));

const displayedServices = computed(() => {
  if (!searchStore.searchInput.trim()) {
    return services.value;
  }
  return searchStore.filteredServices.filter(service => 
    Math.floor(service.id / 100) === serviceId.value
  );
});

const goToServiceType = (serviceType: ServiceType) => {
  router.push({
    name: 'serviceType',
    query: {
      firstTitle: title, 
      title: serviceType.title, 
      parentId: serviceId.value
    }
  });
};

watch(() => route.params.id, (newId) => {
  serviceId.value = Number(newId);
}, { immediate: true });

onMounted(() => {
  searchStore.fetchServiceTypes();
});
</script>

<style scoped lang="scss">
@use '@/styles/colors.scss';

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
  background-color: colors.$white;
  padding: 1.5vw;
  padding-top: 1vw;
  width: 100%;
  box-sizing: border-box;
  overflow: scroll;
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

.breadCrumps{
  display: flex;
  padding-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  flex-wrap: wrap;

  &__services{
    color: #898989;
    cursor: pointer;
    text-decoration: none;
  }

  &__separator{
    color: #898989;
    padding: 0 10px;
  }

  &__serviceType{
    color: #0652FF;
  }
}

@media (max-width: 768px) {
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

  .breadCrumps{
    font-size: 14px;
  }
}
</style>