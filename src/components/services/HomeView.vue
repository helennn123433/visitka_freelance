<template>
  <div class="container">
    <div v-if="loading" class="loading">Загрузка данных...</div>
    <div v-else-if="error" class="error">Ошибка загрузки: {{ error }}</div>
    <div v-else class="cards-field">
      <CardComp
        v-for="service in services"
        :key="service.id"
        :service="service"
        @updated="handleServiceUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
//import { Image } from '@/interfaces/services/Image'
import { Service } from '@/interfaces/services/Servise'
import CardComp from '@/components/services/CardComp.vue'

const services = ref<Service[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchServices = async () => {
  try {
    const response = await axios.get<Service[]>('http://localhost:3004/services')
    services.value = response.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка'
  } finally {
    loading.value = false
  }
}

const handleServiceUpdate = () => {
  fetchServices(); // При обновлении перезагружаем данные
};

onMounted(() => {
  fetchServices()
})
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';

.loading, .error {
  padding: 2rem;
  text-align: center;
  font-size: 1.2rem;
}

.error {
  color: red;
}

.container {
  display: flex;

  flex-direction: column;
  background-color: $white;
  border-radius: 2vw;
  padding: 1.5vw 1vw 2vw 1.5vw;
  box-shadow: 0px 4px 8px $grey;
}
.cards-field {
  flex-grow: 1; // Занимает оставшееся пространство
  min-height: 0; // Решает проблему с flex и overflow
  border-radius: 5vw;
  overflow: hidden;
  overflow-y: auto; // Позволяет прокручивать карточки
  padding: 0.7vw;
  display: flex;
  flex-wrap: wrap; // Перенос картинок
  gap: 1.5vw; // Отступы между изображениями
  justify-content: space-between;
  align-content: space-between;
}

@media (max-width: 650px) { 
  .cards-field {
    gap: 0;
    justify-content: center;
  }
}

@media (max-width: 450px) {
  .container {
    width: 95vw;
  }
  .header {
    flex-direction: column;
    gap: 3vw;
    margin-bottom: 3vw;
    .header-buttons {
      margin-right: 0;
    }
    img {
      width: 3vw;
    }
  }
}
</style>
