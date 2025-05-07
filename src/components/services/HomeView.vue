<template>
  <div class="container">
      <div class="cards-field">
        <CardComp
          v-for="image in images"
          :key="image.id"
          :image="image"
          @updated="handleServiceUpdate"
        />
      </div>
    </div>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import { ref, onMounted } from "vue";
  import { Image } from "@/interfaces/services/Image";  
  //import imagesData from "@/backend/services/images.json"; 
  import CardComp from "@/components/services/CardComp.vue";

  const images = ref<Image[]>([]);
  
  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:3004/services');
      images.value = response.data;
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }
  const handleServiceUpdate = () => {
    fetchServices() 
  };
  
  onMounted(() => {
    fetchServices()
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/colors.scss';

  .container {
    display: flex;
    flex-direction: column;
    background-color: $white;
    border-radius: 3vw;
    //padding: 1.5vw 1vw 2vw 1.5vw;
    padding: 1.5vw;
    box-shadow: 0px 4px 8px $grey;
  }
  .cards-field{
    flex-grow: 1; // Занимает оставшееся пространство
    min-height: 0; // Решает проблему с flex и overflow
    overflow: hidden;
    overflow-y: auto; // Позволяет прокручивать карточки 
    //padding: 0.7vw;
    display: flex;
    flex-wrap: wrap; // Перенос картинок
    gap: 1.5vw; // Отступы между изображениями
    justify-content: space-between;
    align-content: space-between;
  }

  @media (max-width: 767px) {
    .cards-field{
      gap: 0;
      justify-content: center;
    }
    .container {
      border-radius: 0;
      box-shadow: none;
    }
  }

  @media(max-width: 450px){
    .header{
      flex-direction: column;
      gap: 3vw;
      margin-bottom: 3vw;;
      .header-buttons{
        margin-right:0;
      }
      img{
        width: 3vw;
      }
    }
  }
  
</style>
