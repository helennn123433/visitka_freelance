<template>
  <div class="notification-container">
    <Transition name="fade-up">
      <div
        v-if="visible"
        class="notification-modal"
      >
        <div
          :class="textClass"
          class="notification-text"
        >
          {{ message }}
        </div>
        <div
          :class="imgClass"
          class="img-notification"
        />
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
  errorMessage?: string
}>();

const message = computed(() =>
  props.errorMessage || 'Успешно!'
);

const textClass = computed(() =>
  props.errorMessage ? 'error-text' : 'allright-text'
);

const imgClass = computed(() =>
  props.errorMessage ? 'error-img' : 'allright-img'
);

const handleClose = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.notification-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.notification-modal {
  background-color: #eff0f2;
  border-radius: 10px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  padding: 20px 35px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  gap: 15px;
}

.error-text {
  color: #cf1c1c;
  font-size: 15px;
}

.allright-text {
  color: #076423;
  font-size: 15px;
}

.error-img {
  background-image: url('@/shared/ui/icons/assets/cross.svg');
}

.allright-img {
  background-image: url('@/shared/ui/icons/assets/tick.svg');
}

.img-notification {
  width: 30px;
  aspect-ratio: 1 / 1;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 30px;
  color: rgb(121, 121, 121);
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
}

.close-btn:hover {
  color: rgb(84, 84, 84);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-to,
.fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
