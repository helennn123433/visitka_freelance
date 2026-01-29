<template>
  <BaseDialog
    :model-value="modelValue"
    :title="title"
    :size="size"
    :close-on-overlay="closeOnOverlay"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <form
      class="dialog-form"
      @submit.prevent="handleSubmit"
    >
      <slot />
    </form>

    <template #footer>
      <slot name="actions">
        <MyButton
          class="cancel-btn"
          type="button"
          @click="handleClose"
        >
          {{ cancelText }}
        </MyButton>
        <MyButton
          class="submit-btn"
          type="button"
          :disabled="loading"
          @click="handleSubmit"
        >
          {{ loading ? loadingText : submitText }}
        </MyButton>
      </slot>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from './BaseDialog.vue';
import { MyButton } from '@shared/ui/button';
import type { FormDialogProps } from '@shared/types';

withDefaults(defineProps<FormDialogProps>(), {
  size: 'medium',
  submitText: 'Сохранить',
  cancelText: 'Отмена',
  loadingText: 'Загрузка...',
  loading: false,
  closeOnOverlay: false
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [];
  close: [];
}>();

const handleSubmit = () => {
  emit('submit');
};

const handleClose = () => {
  emit('close');
  emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped>
.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submit-btn {
  min-width: 100px;
}

.cancel-btn {
  min-width: 100px;
  background-color: #e0e0e0 !important;
  color: #333 !important;

  &:hover {
    background-color: #bdbdbd !important;
  }
}
</style>
