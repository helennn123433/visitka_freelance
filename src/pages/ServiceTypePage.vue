<template>
  <div class="serviceTypePage">
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
      <div 
        class="breadCrumps__services"
        @click="$router.back()"
      >
        {{ firstTitle.toUpperCase() }}
      </div>
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
          v-if="examples.length > 0" 
          class="cards-grid"
        >
          <div 
            v-for="example in examples" 
            :key="example.id" 
            class="card"
          >
            <img 
              :src="example.image" 
              :alt="'Example ' + example.id" 
              class="image"
            >
          </div>
        </div>
        <div v-else>
          <p v-if="isLoading">
            Загрузка...
          </p>
          <p v-else>
            Примеры работ не найдены
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import MyHeader from '@/components/ui/MyHeader.vue';
import type { Service, Example } from '@/interfaces/servicesTypes/servicesTypes';

const route = useRoute();
const firstTitle = route.query.firstTitle as string;
const title = route.query.title as string;
const parentId = Number(route.query.parentId);

const isLoading = ref(true);
const examples = ref<Example[]>([]);

const fetchExamples = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get('/api/servicestypes');
    const servicesData: Service[] = response.data || [];
    
    // Находим нужный родительский объект по ID
    const parentService = servicesData.find(service => service.id === parentId);
    if (!parentService) {
      examples.value = [];
      return;
    }

    // Находим нужный тип услуги по title внутри родительского объекта
    const foundType = parentService.types.find(type => type.title === title);
    examples.value = foundType?.examples || [];
  } catch (error) {
    console.error('Ошибка:', error);
    examples.value = [];
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => {
  fetchExamples();
});

watch(() => route.query.title, () => {
  fetchExamples();
});
</script>

<style lang="scss" scoped>
@use '@/styles/colors.scss';

.serviceTypePage {
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
  padding: 10px;
}

.card {
  width: 240px;
  height: 240px;
  overflow: hidden;
  position: relative;
  box-shadow: 4px 4px 5px rgba(0,0,0, 0.2);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.breadCrumps {
  display: flex;
  padding-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  flex-wrap: wrap;

  &__services {
    color: #898989;
    cursor: pointer;
    text-decoration: none;
  }

  &__separator {
    color: #898989;
    padding: 0 10px;
  }

  &__serviceType {
    color: #0652FF;
  }
}

@media (max-width: 768px) {
  .serviceTypePage{
    padding: 1rem;
  }

  .card{
    width: 90%;
  }
}

@media (max-width: 450px) {
  .breadCrumps {
    font-size: 14px;
  }
}
</style>