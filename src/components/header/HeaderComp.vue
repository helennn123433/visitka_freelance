<template>
  <div class="header">
    <SearchComp />
    <ButtonsComp v-if="Show" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import SearchComp from '@/components/header/SearchComp.vue'

import ButtonsComp from "@/components/header/ButtonsComp.vue";
  const Show = ref(true)
  const isMobile = ref(window.innerWidth < 769)
  const handleResize = () => {
    isMobile.value = window.innerWidth < 769
    if (isMobile.value) {
      Show.value = false
    }else Show.value = true
  }

  onMounted(() => {
    if (isMobile.value) {
      Show.value = false 
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
    &.account-icon {
      width: 2.5vw;
    }
  }
}

  @media(max-width: 768px){
    .header{
      padding: 0 16px;
      width: auto;
    }
  }
</style>
