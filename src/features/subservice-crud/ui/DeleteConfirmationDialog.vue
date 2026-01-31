<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3>Подтверждение удаления</h3>
      </div>

      <div class="modal-body">
        <p v-if="type === 'subservice'">
          Вы уверены, что хотите удалить все подуслуги? Это действие нельзя отменить.
        </p>
        <p v-else-if="type === 'type'">
          Вы уверены, что хотите удалить тип?
          Это действие нельзя отменить.
        </p>
        <p v-else>
          Вы уверены, что хотите удалить этот элемент?
        </p>
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
  type: 'subservice' | 'type';
  itemTitle?: string;
  itemId: string;
  subserviceId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  confirm: [data: { itemId: string; subserviceId?: string; type: 'subservice' | 'type' }];
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
      subserviceId: props.subserviceId,
      type: props.type
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
  width: 25vw;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
@media (max-width: 768px) {
  .modal {
    width: 80vw;
  }
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
  margin: 0 0 12px 0;
  line-height: 1.5;
  color: #555;
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
