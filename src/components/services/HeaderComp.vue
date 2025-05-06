<template>
    <div class="header">
      <SearchComp />
      <ButtonsComp v-if="Show"></ButtonsComp>
    </div>
  </template>
  
  <script setup lang="ts" >
  import { ref, onMounted, onUnmounted } from "vue";
  import SearchComp from "@/components/services/SearchComp.vue"
  import ButtonsComp from "./ButtonsComp.vue";
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
  </style>