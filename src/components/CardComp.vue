<template>
  <div class="card">
    <img
      :src="image.src"
      :alt="image.alt"
      class="image"
    >
    <div class="price">
      {{ image.price }}
    </div>
    <!--<div class="gradient"></div>-->
    <div class="title">
      {{ image.title }}
    </div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    image: { src: string; alt: string; title: string; price: string; };
  }>();
</script>
<style lang="scss">
  .image {
    width: 100%; // Изображения занимают всю ширину контейнера
    height: 100%;
    background-size: cover; // Изображение будет масштабироваться с сохранением пропорций
    background-position: center; // Центрируем изображение
    position: relative;
    overflow: hidden;
  }

  .card {
    flex: 0 0 48%;
    position: relative;
    color: $white;
    width: auto;
    overflow: hidden;
    border-radius: 32px;
    cursor: pointer;
    .price {
      position: absolute;
      display: flex;
      align-items: center; 
      justify-content: center; 
      top: 5%;
      right: 5%;
      background-color: $blue;
      color: $white;
      border-radius: 19px;
      font-weight: bold;
      width: 30%;
      height: 20%;
      z-index: 10;
    }
    .gradient{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30%;
      background: linear-gradient(to top, $blue, transparent);
      z-index: 5;
    }
    .title{
      position: absolute;
      bottom: 5%;
      left: 5%;
      z-index: 10;
      color: $white;
      font-weight: bold;
    }
    @media (max-width: 1400px) {
      .title {
        font-size: 32px;
      }
      .price {
        font-size: 16px;
      }
    }
    @media (max-width: 940px) {
      .title {
        font-size: 25px;
      }
      .price {
        font-size: 12px;
        border-radius: 15px;
      }
    }
    @media (max-width: 730px) {
      border-radius: 25px;
      .title {
        font-size: 17px;
      }
      .price {
        font-size: 10px;
        border-radius: 13px;
      }
    }
  }
  @media(max-width: 650px){
    .card {
      flex: 0 0 96%;
      margin-bottom: 16px;
      .title {
        font-size: 32px;
      }
      .price {
        font-size: 16px;
      }
    }
    .card:last-of-type {
      margin-bottom: 0;
    }
  }
  @media(max-width: 530px){
    .card {
      flex: 0 0 96%;
      .title {
        font-size: 25px;
      }
      .price {
        font-size: 12px;
        border-radius: 15px;
      }
    }
  }
  @media(max-width: 450px){
    .card {
      flex: 0 0 96%;
      border-radius: 25px;
      .title {
        font-size: 17px;
      }
      .price {
        font-size: 10px;
        border-radius: 13px;
      }
    }
  }
  @media(max-width: 360px){
    .card {
      flex: 0 0 96%;
      border-radius: 18px;
      .title {
        font-size: 15px;
      }
      .price {
        font-size: 8px;
        border-radius: 10px;
      }
    }
  }

</style>
