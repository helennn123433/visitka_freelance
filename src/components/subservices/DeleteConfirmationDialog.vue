<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3>Подтверждение удаления</h3>
      </div>
      
      <div class="modal-body">
        <p v-if="type === 'subservice'">
          Вы уверены, что хотите удалить подуслугу? Это действие нельзя отменить.
        </p>
        <p v-else-if="type === 'type'">
          Вы уверены, что хотите удалить тип "<strong>{{ itemTitle }}</strong>"? 
          Это действие нельзя отменить.
        </p>
        <p v-else>
          Вы уверены, что хотите удалить этот элемент?
        </p>
      </div>
      
      <div class="modal-buttons">
        <my-button
          class="delete-btn"
          variant="danger"
          @click="confirm"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Удаление...' : 'Удалить' }}
        </my-button>
        <my-button
          class="cancel-btn"
          @click="cancel"
          :disabled="isLoading"
        >
          Отмена
        </my-button>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import MyButton from '@/components/ui/MyButton.vue';

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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  margin: 0 0 12px 0;
  line-height: 1.5;
  color: #555;
}

.item-info {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
  border-left: 4px solid #6c757d;
}

.item-info p {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
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