<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3>Подтверждение удаления</h3>
      </div>

      <div class="modal-body">
        <p>
          Вы уверены, что хотите удалить пример работы?
          Это действие нельзя отменить.
        </p>

        <div
          v-if="itemImage"
          class="image-preview"
        >
          <img
            :src="itemImage"
            alt="Удаляемый пример"
          >
        </div>
      </div>

      <div class="modal-buttons">
        <MyButton
          class="delete-btn"
          :disabled="isLoading"
          @click="confirm"
        >
          {{ isLoading ? 'Удаление...' : 'Удалить' }}
        </MyButton>
        <MyButton
          class="cancel-btn"
          :disabled="isLoading"
          @click="cancel"
        >
          Отмена
        </MyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MyButton } from '@shared/ui/button';

interface Props {
  itemId: string;
  itemImage?: string;
  typeId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  confirm: [data: { itemId: string; typeId: string }];
  cancel: [];
}>();

const isLoading = ref(false);

const confirm = async (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  isLoading.value = true;
  try {
    const confirmData = {
      itemId: props.itemId,
      typeId: props.typeId
    };

    emit('confirm', confirmData);
  } finally {
    isLoading.value = false;
  }
};

const cancel = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  emit('cancel');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.modal-body {
  margin-bottom: 24px;
}

.modal-body p {
  margin: 0 0 16px 0;
  line-height: 1.5;
  color: #555;
}

.image-preview {
  margin-top: 16px;
  width: 100%;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.modal-buttons {
  display: flex;
  justify-content: space-evenly;
  gap: 12px;
}

.delete-btn {
  padding: 1.5vh;
  background-color: #dc3545;
  border-color: #dc3545;
}

.delete-btn:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.cancel-btn {
  padding: 1.5vh;
  background-color: #6c757d;
  border-color: #6c757d;
}

.cancel-btn:hover {
  background-color: #5a6268;
  border-color: #545b62;
}
</style>
