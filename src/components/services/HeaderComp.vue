<template>
    <div class="header">
      <SearchComp />
      <div class="header-buttons" v-if="Show">
        <img src="@/assets/img/services/phone-icon.svg" alt="Иконка телефона" class="icon phone-icon" />
        <img src="@/assets/img/services/tg-icon.svg" alt="Иконка телеграма" class="icon" />
        <img src="@/assets/img/services/email-icon.svg" alt="Иконка почты" class="icon" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts" >
  import { ref, onMounted, onUnmounted } from "vue";
  import SearchComp from "@/components/services/SearchComp.vue"
  const Show = ref(true)
  const isMobile = ref(window.innerWidth < 768)
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value) {
      Show.value = false // скрываем значки
    }else Show.value = true
  }

  onMounted(() => {
    if (isMobile.value) {
      Show.value = false // скрываем значки
    }else Show.value = true
    window.addEventListener('resize', handleResize)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  </script>
  
  <style lang="scss" scoped>
  .header{
    width:100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1vw;
  }
  
  .header-buttons {
    display: flex;
    gap: 2vw;
  
    img {
      width: 2vw;
      cursor: pointer;
  
      &:hover {
        filter: brightness(0.1) invert(0.3);
      }
      &.phone-icon {  
        width: 1.7vw; 
      }
    }
  }
  </style>