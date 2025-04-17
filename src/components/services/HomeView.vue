<template>
  <div class="container">
      <div class="header">
        <SearchComp />
        <div class="header-buttons">
          <img src="@/assets/img/services/phone-icon.svg" alt="Иконка телефона" class="icon" />
          <img src="@/assets/img/services/tg-icon.svg" alt="Иконка телеграма" class="icon" />
          <img src="@/assets/img/services/email-icon.svg" alt="Иконка почты" class="icon" />
        </div>
      </div>
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
  import { ref, onMounted } from "vue";
  import { Image } from "@/interfaces/services/Image";  // Импортируем интерфейс
  import imagesData from "@/backend/services/images.json"; // Импортируем картинки из JSON
  import CardComp from "@/components/services/CardComp.vue";
  import SearchComp from "@/components/services/SearchComp.vue";

  const images = ref<Image[]>([]);
  onMounted(() => {
    images.value = imagesData;
  });
</script>
<style lang="scss">
  @import '../../styles/colors.scss';
  .header{
    width:100%;
    position: sticky;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1vw;
    padding-left: 0.7vw;
  }
  .header-buttons{
    display: flex;
    gap: 2vw;
    margin-right: 2vw;
    img{
      width: 2vw;
    }
    img:hover{
      filter: brightness(0.1) invert(0.3);
    }
  }
  .icon{
    cursor: pointer;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    background-color: $white;
    border-radius: 2vw;
    padding: 1.5vw;
    box-shadow: 0px 4px 8px $grey;
    //height: calc(100vh - 40px); /* 100% высоты экрана минус отступы */
    // overflow: hidden; /* Запрещаем общий скролл страницы */
    width: 75vw;
  }
  .cards-field{
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

  @media(max-width: 650px){
    .cards-field{
      gap: 0;
      justify-content: center;
    }
  }

  @media(max-width: 450px){
    .container{
      width: 95vw;
    }
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
