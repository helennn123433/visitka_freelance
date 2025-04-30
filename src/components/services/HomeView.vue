<template>
  <div class="container">
    <div class="cards-field">
      <CardComp
        v-for="(image, index) in images"
        :key="index"
        :image="image"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Image } from '@/interfaces/services/Image' // Импортируем интерфейс
import imagesData from '@/backend/services/images.json' // Импортируем картинки из JSON
import CardComp from '@/components/services/CardComp.vue'

const images = ref<Image[]>([])
onMounted(() => {
  images.value = imagesData
})
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';

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
