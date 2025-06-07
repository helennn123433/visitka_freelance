<template>
  <div class="modal-overlay">
    <div class="modal">
      <p>Подтвердите удаление услуги</p>
      <div class="modal-buttons">
        <MyButton
          class="delete-btn"
          @click="confirm($event)"
        >
          Подтвердить
        </MyButton>
        <MyButton
          class="cancel-btn"
          @click="cancel($event)"
        >
          Отмена
        </MyButton>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import MyButton from '@/components/ui/MyButton.vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['confirm', 'cancel']);

const confirm = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  emit('confirm');
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
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border: 2px solid #eff0f2;
    border-radius: 32px;
    text-align: center;
    color: black;
    max-width: 400px;
    width: 90%;
  }
  
  .modal-buttons {
    margin-top: 20px;
    display: flex;
    gap: 15px;
    justify-content: center;
  }
  
  .delete-btn {
    background-color: #ff4444;
    padding: 1.5vh;
  }
  
  .delete-btn:hover {
    background-color: #cc0000;
  }
  
  .cancel-btn {
    background-color: #cccccc !important;
    padding: 1.5vh;
    color: #333;
  }
  
  .cancel-btn:hover {
    background-color: #aaaaaa !important;
  }
  
  /* Адаптация под мобильные устройства */
  @media (max-width: 480px) {
    .modal-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .modal-buttons MyButton {
      width: 100%;
    }
  }
  </style>