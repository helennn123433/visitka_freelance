<template>
  <div 
    class="modal-overlay" 
    @click.self="$emit('close')"
  >
    <div class="modal-content">
      <button 
        class="close-btn" 
        @click="$emit('close')"
      >
        &times;
      </button>
      
      <img 
        :src="getImageUrl(example.image)" 
        :alt="example.title" 
        class="modal-image"
      >
      
      <div class="modal-info">
        <h3>{{ example.title || 'Без названия' }}</h3>
        <p class="description">
          {{ example.description || 'Описание отсутствует' }}
        </p>
        <div 
          v-if="example.price" 
          class="price-tag"
        >
          <span>Цена:</span> <strong>{{ example.price }} ₽</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '@shared/lib/getImageUrl';
import type { Example } from '@entities/example';

defineProps<{
  example: Example
}>();

defineEmits(['close']);
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.close-btn {
  position: absolute;
  top: 3px;
  right: 3px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-image {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.modal-info {
  h3 {
    margin: 0 0 10px 0;
    font-size: 1.25rem;
  }
  .description {
    font-size: 0.9rem;
    color: #555;
    line-height: 1.4;
    margin-bottom: 15px;
  }
  .price-tag {
    font-size: 1rem;
    color: #0652ff;
    border-top: 1px solid #eee;
    padding-top: 10px;
  }
}
</style>