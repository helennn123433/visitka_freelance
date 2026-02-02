<template>
  <div class="header">
    <SearchInput />
    <HeaderButtons 
      v-if="showButtons" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SearchInput } from '@features/search';
import HeaderButtons from './HeaderButtons.vue';
import { useBreakpoints } from '@shared/lib';

const { isMobile } = useBreakpoints();

const showButtons = computed(() => !isMobile.value);
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1vw;
  padding-right: 1vw;
}

@media(max-width: 768px) {
  .header {
    padding: 0 16px;
    width: auto;
  }
}
</style>
