<template>
  <div class="sevicePage">
    <h1>{{ title }}</h1>
  </div>
</template>
    
<script setup lang='ts'>
import { useRoute } from 'vue-router';

const route = useRoute();
const title = route.query.title as string;
</script>
    
<style>
    
</style>