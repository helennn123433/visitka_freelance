<template>
  <ConfirmDialog
    v-model="isOpen"
    title="Удаление услуги"
    message="Вы уверены, что хотите удалить эту услугу?"
    confirm-text="Удалить"
    cancel-text="Отмена"
    variant="danger"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ConfirmDialog } from '@shared/ui/dialog';

const props = defineProps<{
  visible?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const isOpen = ref(props.visible ?? true);

watch(() => props.visible, (val) => {
  if (val !== undefined) {
    isOpen.value = val;
  }
});

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>
