<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="modelValue"
        class="dialog-overlay"
        @click.self="handleOverlayClick"
      >
        <div
          class="dialog-content"
          :class="[sizeClass, { 'dialog-content--centered': centered }]"
        >
          <div 
            v-if="$slots.header || title" 
            class="dialog-header"
          >
            <slot name="header">
              <h3 class="dialog-title">
                {{ title }}
              </h3>
            </slot>
          </div>

          <div class="dialog-body">
            <slot />
          </div>

          <div 
            v-if="$slots.footer" 
            class="dialog-footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DialogProps } from "@shared/types";

const props = withDefaults(defineProps<DialogProps>(), {
  title: "",
  size: "medium",
  closeOnOverlay: true,
  centered: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

const sizeClass = computed(() => `dialog-content--${props.size}`);

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    emit("update:modelValue", false);
    emit("close");
  }
};

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

defineExpose({ close });
</script>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &--small {
    width: 90%;
    max-width: 20vw;
    max-height: 15vw;
  }

  &--medium {
    width: 90%;
    max-width: 25vw;
    max-height: 26vw;
  }

  @media (max-width: 820px) {
    &--medium {
      max-width: 90vw;
      max-height: 80vh;
    }
  }
  &--large {
    width: 90%;
    max-width: 640px;
  }

  &--centered {
    text-align: center;
  }
}

.dialog-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.dialog-body {
  padding: 20px;
  flex: 1;
}

.dialog-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-active .dialog-content,
.dialog-leave-active .dialog-content {
  transition: transform 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog-content,
.dialog-leave-to .dialog-content {
  transform: scale(0.95);
}

@media (max-width: 480px) {
  .dialog-content {
    width: 95%;
    margin: 10px;
  }

  .dialog-footer {
    flex-direction: column;

    :deep(button) {
      width: 100%;
    }
  }
}
</style>
