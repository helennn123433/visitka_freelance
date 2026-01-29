<template>
  <div class="header">
    <SearchInput />
    <HeaderButtons v-if="showButtons" />
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
  width: 100%;
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

@media(max-width: 768px) {
  .header {
    padding: 0 16px;
    width: auto;
  }
}
</style>
