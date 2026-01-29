<template>
  <div
    :id="serviceId"
    class="card"
    @click="handleCardClick"
  >
    <div
      v-if="showAdminControls"
      class="adminCard"
    >
      <img
        class="settings-icon"
        :src="Icons.Gear"
        alt="шестерёнка"
        @click.stop="handleEdit"
      >
      <img
        class="delete-icon"
        :src="Icons.Trash"
        alt="мусорка"
        @click.stop="handleDelete"
      >
    </div>
    <img
      :src="imageUrl"
      class="image"
    >
    <div
      v-if="hasPrice"
      class="price"
    >
      {{ `от ${servicePrice} Р/час` }}
    </div>
    <div class="title">
      {{ service.title || 'Без названия' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Service } from '../model/types';
import { Icons } from '@shared/ui/icons';
import { getImageUrl } from '@/shared/lib/getImageUrl';

const props = defineProps<{
  service: Service;
  showPrice?: boolean;
  showAdminControls?: boolean;
}>();

const emit = defineEmits<{
  click: [service: Service];
  edit: [service: Service];
  delete: [service: Service];
}>();

const serviceId = computed(() => props.service?.id?.toString() || 'unknown');
const servicePrice = computed(() => props.service?.price || 0);
const imageUrl = computed(() => getImageUrl(props.service.image));

const hasPrice = computed(() => {
  if (props.showPrice === false) return false;
  return props.service && 'price' in props.service && typeof props.service.price === 'number';
});

const handleCardClick = () => {
  emit('click', props.service);
};

const handleEdit = () => {
  emit('edit', props.service);
};

const handleDelete = () => {
  emit('delete', props.service);
};
</script>

<style lang="scss" scoped>
$blue: #0652FF;
$white: #FFFFFF;

.image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
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

  img {
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

  .title {
    position: absolute;
    bottom: 7%;
    left: 7%;
    z-index: 10;
    color: $white;
    text-transform: uppercase;
    font-weight: 800;
    font-size: 2.5vw;
  }

  .price,
  .title {
    transition: transform 0.3s ease, font-size 0.3s ease;
  }

  .delete-icon {
    position: absolute;
    top: 8%;
    left: 12%;
    width: 2vw;
    height: 2vw;
    cursor: pointer;
    z-index: 20;
    filter: brightness(0) invert(1);
    transition: transform 0.3s ease;
  }

  .delete-icon:hover {
    transform: scale(1.2);
  }
}

.settings-icon {
  position: absolute;
  top: 9%;
  left: 5%;
  width: 1.5vw;
  height: 1.5vw;
  cursor: pointer;
  z-index: 20;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
  transform-origin: center;
}

.settings-icon:hover {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media(max-width: 800px) {
  .settings-icon {
    width: 4vw;
    height: 4vw;
    top: 9%;
    left: 3%;
  }

  .adminCard .delete-icon {
    width: 5vw;
    height: 5vw;
    top: 8%;
    left: 12%;
  }

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
      background-color: transparent;
      transform: translateX(2vw) scale(1.2);
    }

    .card:hover .title {
      transform: translateX(-2vw) scale(1.2);
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
  transition: opacity 0.3s ease;
}

.card:hover::after {
  opacity: 0.5;

  .price {
    background-color: none;
  }
}

.card:hover .price {
  background-color: transparent;
  transform: translateX(1vw) scale(1.05);
}

.card:hover .title {
  transform: translateX(-1vw) scale(1.05);
}
</style>
