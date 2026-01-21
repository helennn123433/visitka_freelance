<template>
  <nav class="breadcrumbs">
    <template v-for="(item, index) in items" :key="index">
      <component
        :is="item.to ? 'router-link' : 'span'"
        :to="item.to"
        :class="[
          'breadcrumbs__item',
          { 'breadcrumbs__item--link': item.to || item.onClick },
          { 'breadcrumbs__item--active': index === items.length - 1 }
        ]"
        @click="item.onClick"
      >
        {{ item.label.toUpperCase() }}
      </component>
      <span v-if="index < items.length - 1" class="breadcrumbs__separator">
        {{ separator }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  label: string;
  to?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
}

withDefaults(defineProps<BreadcrumbsProps>(), {
  separator: '»'
});
</script>

<style scoped lang="scss">
$blue: #0652FF;
$grey: #898989;

.breadcrumbs {
  display: flex;
  padding-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  flex-wrap: wrap;

  &__item {
    color: $blue;
    text-decoration: none;

    &--link {
      color: $grey;
      cursor: pointer;
    }

    &--active {
      color: $blue;
      cursor: default;
    }
  }

  &__separator {
    color: $grey;
    padding: 0 10px;
  }
}

@media (max-width: 450px) {
  .breadcrumbs {
    font-size: 14px;
  }
}
</style>
