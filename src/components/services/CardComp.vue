<template>
  <div class="card" id=image.id>
    <img
      :src="image.image"
      class="image"
    >
    <div class="price">
      {{ `от ${image.price} Р/час` }}
    </div>
    <div class="title">
      {{ image.title }}
    </div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    image: { id: number; title: string; price: string; image: string; };
  }>();
</script>
<style lang="scss" scoped>
@import '../../styles/colors.scss';
  .image {
    width: 100%; // Изображения занимают всю ширину контейнера
    height: 100%;
    background-size: cover; // Изображение будет масштабироваться с сохранением пропорций
    background-position: center; // Центрируем изображение
    position: relative;
    overflow: hidden;
  }

  .card {
    flex: 0 0 48.5%;
    position: relative;
    color: $white;
    width: auto;
    overflow: hidden;
    border-radius: 3vw;
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
      border-radius: 1.5vw;
      font-weight: bold;
      font-size: 1vw;
      padding: 1.5vw 1vw;
      z-index: 10;
      transition: background-color 0.3s ease;
    }
    .title{
      position: absolute;
      bottom: 7%;
      left: 7%;
      z-index: 10;
      color: $white;
      font-weight: bold;
      text-transform: uppercase;
      font-weight: 800;
      font-size: 2.5vw;
    }
    .price, .title {
      transition: transform 0.3s ease, font-size 0.3s ease;
    }
  }
  @media(max-width: 800px){
    .card {
      border-radius: 5vw;
      flex: 0 0 100%;
      margin-bottom: 2vw;
      .title {
        font-size: 6vw;
      }
      .price {
        font-size: 3vw;
        padding: 3vw 2vw;
        border-radius: 3.4vw;
      }
      .card:hover .price {
        background-color: transparent; /* Убираем фон при наведении */
        transform: translateX(2vw) scale(1.2); /* Двигаем вправо */
      }
    
      .card:hover .title {
        transform: translateX(-2vw) scale(1.2); /* Двигаем влево */
      }
    }
    .card:last-of-type {
      margin-bottom: 0;
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
    transform: translateX(1vw) scale(1.1); /* Двигаем вправо */
  }

  .card:hover .title {
    transform: translateX(-1vw) scale(1.1); /* Двигаем влево */
  }

</style>
