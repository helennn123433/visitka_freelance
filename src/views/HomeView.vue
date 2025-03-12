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
  import CardComp from "@/components/CardComp.vue";
  import SearchComp from "@/components/SearchComp.vue";

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
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .header-buttons{
    display: flex;
    gap: 20px;
  }
  .icon{
    cursor: pointer;
  }
  .container{
    background-color: $white;
    border-radius: 35px;
    padding: 16px;
    box-shadow: 0px 4px 8px $grey;
  }
  .cards-field{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap; // Перенос картинок
    gap: 16px; // Отступы между изображениями
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
      gap: 16px;
    }
  }
  
</style>
