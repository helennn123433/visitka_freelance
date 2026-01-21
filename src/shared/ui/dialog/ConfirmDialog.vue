<template>
  <BaseDialog
    :model-value="modelValue"
    :title="title"
    size="small"
    :close-on-overlay="false"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="$emit('cancel')"
  >
    <p class="confirm-message">
      {{ message }}
    </p>

    <template #footer>
      <MyButton
        :class="['confirm-btn', variant === 'danger' ? 'confirm-btn--danger' : '']"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </MyButton>
      <MyButton
        class="cancel-btn"
        @click="handleCancel"
      >
        {{ cancelText }}
      </MyButton>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from './BaseDialog.vue';
import { MyButton } from '@shared/ui/button';

export interface ConfirmDialogProps {
  modelValue: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

withDefaults(defineProps<ConfirmDialogProps>(), {
  title: 'Подтверждение',
  confirmText: 'Подтвердить',
  cancelText: 'Отмена',
  variant: 'default'
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const handleConfirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};

const handleCancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped>
.confirm-message {
  margin: 0;
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
}

.confirm-btn {
  min-width: 100px;

  &--danger {
    background-color: #ff4444 !important;

    &:hover {
      background-color: #cc0000 !important;
    }
  }
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
