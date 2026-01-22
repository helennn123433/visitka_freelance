<template>
  <div class="notification-container">
    <Transition name="slide-up">
      <div
        v-if="visible"
        :class="['notification-modal', type === 'error' ? 'notification-error' : 'notification-success']"
      >
        <span class="notification-icon">
          {{ type === 'error' ? '✕' : '✓' }}
        </span>
        <span class="notification-text">
          {{ displayMessage }}
        </span>
        <button
          class="close-btn"
          @click="handleClose"
        >
          ×
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits<{
  close: []
}>();

const props = defineProps<{
  visible: boolean
  message?: string
  type?: 'success' | 'error'
}>();

const displayMessage = computed(() =>
  props.message || 'Успешно!'
);

const handleClose = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
$blue: #0652FF;
$error: #E53935;
$white: #FFFFFF;

.notification-container {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.notification-modal {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 48px 16px 24px;
  border-radius: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Inter_normal', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: $white;
  position: relative;
  min-width: 200px;
}

.notification-success {
  background: linear-gradient(135deg, $blue 0%, darken($blue, 10%) 100%);
}

.notification-error {
  background: linear-gradient(135deg, $error 0%, darken($error, 10%) 100%);
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba($white, 0.2);
  font-size: 12px;
  font-weight: 700;
}

.notification-text {
  flex: 1;
}

.close-btn {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 20px;
  color: rgba($white, 0.7);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s ease;

  &:hover {
    color: $white;
  }
}

.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-leave-active {
  transition: all 0.2s ease-in;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
