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
  import { ref } from "vue";
  import CardComp from "@/components/services/CardComp.vue";
  import SearchComp from "@/components/services/SearchComp.vue";

  interface Image {
    src: string;
    alt: string;
    title: string;
    price: string;
  }
  // Используем свойство с типом Image[]
  const images = ref<Image[]>([
    {
      src: "https://avatars.mds.yandex.net/i?id=9c29de4d7c8431e0a99966cb2ab938a9e4b6fba3-8522161-images-thumbs&n=13",
      alt: "Image 1",
      title: "Card 1",
      price: "от 1200 Р/час"
    },
    {
      src: "https://i.ytimg.com/vi/I0JtD7hxdds/maxresdefault.jpg",
      alt: "Image 2",
      title: "Card 2",
      price: "от 1200 Р/час"
    },
    {
      src: "https://avatars.mds.yandex.net/i?id=6adfc3b38f261cf6f55babcbdfca603596bb2fa5-4612626-images-thumbs&n=13",
      alt: "Image 3",
      title: "Card 3",
      price: "от 1200 Р/час"
    },
    {
      src: "https://avatars.mds.yandex.net/i?id=8cf4526926eb2a43fba77298842822510fc5aa4d-7664017-images-thumbs&n=13",
      alt: "Image 4",
      title: "Card 4",
      price: "от 1200 Р/час"
    },
    {
      src: "https://avatars.mds.yandex.net/i?id=ec806c2691eeeb8fcf37218273a716ce0ee58dff-8981283-images-thumbs&n=13",
      alt: "Image 5",
      title: "Card 5",
      price: "от 1200 Р/час"
    },
    {
      src: "https://avatars.mds.yandex.net/i?id=232120f27e904b9a43ccd4aa6d941cd3635191f4-8324697-images-thumbs&n=13",
      alt: "Image 6",
      title: "Card 6",
      price: "от 1200 Р/час"
    },
  ]);
</script>
<style lang="scss">
  .header{
    width:100%;
    position: sticky;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1vw;
  }
  .header-buttons{
    display: flex;
    gap: 2vw;
    margin-right: 2vw;
    img{
      width: 3vw;
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
    border-radius: 5vw;
    padding: 1.5vw;
    box-shadow: 0px 4px 8px $grey;
    height: calc(100vh - 40px); /* 100% высоты экрана минус отступы */
    overflow: hidden; /* Запрещаем общий скролл страницы */
  }
  .cards-field{
    flex-grow: 1; // Занимает оставшееся пространство
    min-height: 0; // Решает проблему с flex и overflow
    border-radius: 5vw;
    overflow: hidden;
    overflow-y: auto; // Позволяет прокручивать карточки 
    padding: 1vw;
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
    .header{
      flex-direction: column;
      gap: 3vw;
      margin-bottom: 3vw;;
      .header-buttons{
        margin-right:0;
      }
    }
  }
  
</style>
