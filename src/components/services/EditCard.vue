<template>
    <div class="modal-overlay">
      <div class="modal">
        <h2>Редактирование карточки</h2>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Название:</label>
            <input v-model="formData.title" type="text">
          </div>
  
          <div class="form-group">
            <label>Цена:</label>
            <input v-model="formData.price" type="text">
          </div>
  
          <div class="form-group">
            <label>Изображение (URL):</label>
            <input v-model="formData.image" type="url">
          </div>
  
          <div class="button-group">
            <MyButton type="button" @click="$emit('close')">
            Отмена
          </MyButton>
          <MyButton type="submit">
            Сохранить
          </MyButton>
          </div>
        </form>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, watch} from 'vue';
import { Service } from '@/interfaces/services/Servise';
import MyButton from '@/components/ui/MyButton.vue';

const props = defineProps<{
  currentData: Service;
}>();

const emit = defineEmits(['close', 'save']);

const formData = ref({ ...props.currentData });

watch(() => props.currentData, (newVal) => {
  formData.value = { ...newVal };
});

const handleSubmit = () => {
  const dataToSave = {
    ...formData.value,
    price: Number(formData.value.price)
  };
  emit('save', dataToSave);
};
</script>
  
<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    color: black;
    border: 2px solid #eff0f2;
    border-radius: 32px;
    background: white;
    padding: 20px 30px;
    width: 90%;
    max-width: 500px;
    box-sizing: border-box;
  }
  
  .form-group {
    margin-bottom: 1rem;
    width: 100%;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box; /* Важное свойство */
    transition: border-color 0.3s ease;
    max-width: 100%; /* Гарантируем, что не выйдет за границы */
  }
  
  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    justify-content: space-between;
  }
  .button-group :first-child {
    background-color: #ff4444; /* Красный цвет для отмены */
  }

  .button-group :first-child:hover {
    background-color: #cc0000;
  }

  .button-group :nth-child(2):hover {
    background-color: #082f8b;
  }

  button {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  @media (max-width: 480px) {
  .modal {
    padding: 15px 20px;
    border-radius: 24px;
  }
  
  .form-group input {
    padding: 8px 10px;
    font-size: 13px;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }
  
  .button-group MyButton {
    width: 100%;
    justify-content: center;
  }
}
  </style>