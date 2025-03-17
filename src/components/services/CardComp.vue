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
    flex: 0 0 49%;
    position: relative;
    color: $white;
    width: auto;
    overflow: hidden;
    border-radius: 32px;
    cursor: pointer;
    img{
      transition: opacity 0.3s ease;
    }
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
      font-size: 27px;
      padding: 20px;
      z-index: 10;
      transition: background-color 0.3s ease;
    }
    .title{
      position: absolute;
      bottom: 10%;
      left: 10%;
      z-index: 10;
      color: $white;
      font-weight: bold;
      text-transform: uppercase;
      font-weight: 800;
      //font-size: 10%;
      font-size: 32px;
    }
    .price, .title {
      transition: transform 0.3s ease, font-size 0.3s ease;
    }
    @media (min-width: 1405px) {
      .title {
        font-size: 3vw;
      }
      .price {
        font-size: 2vw;
        padding: 2vw;
      }
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
  .card::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: $blue; 
    opacity: 0;
    transition: opacity 0.3s ease;  //анимация для заливки при наведении
  }

  .card:hover::after {  //анимация при наведении
    opacity: 0.5; 
    .price{
      background-color: none;
    }
  }

  .card:hover .price {
    background-color: transparent; /* Убираем фон при наведении */
    transform: translateX(20px) scale(1.2); /* Двигаем вправо */
  }

  .card:hover .title {
    transform: translateX(-20px) scale(1.2); /* Двигаем влево */
  }

</style>
