<template>
  <div class="main__app">
    <div>
      <sidebar-component />
    </div>
    <div class="all__staff">
      <!--      внутри этого элементе должны быть остальные окна-->
      <about-us />
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/sidebar/SidebarComponent.vue';
import AboutUs from '@/components/aboutUs/AboutUs.vue';
</script>

<style>
.main__app {
  display: flex;
  padding: 1vw;
  background-color: #eff0f2;
}
.all__staff {
  max-height: 100vh;
}
</style>
