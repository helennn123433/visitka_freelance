<template>
  <div
    class="modal-overlay"
    @click.self="closeModal"
  >
    <div class="modal">
      <h2>Редактирование карточки</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Название:</label>
          <input 
            v-model="formData.title" 
            type="text"
            :class="{ 'invalid': errors.title }"
            @click.stop
          >
          <span
            v-if="errors.title"
            class="error"
          >{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label>Цена:</label>
          <input 
            v-model.number="formData.price" 
            type="number"
            :class="{ 'invalid': errors.price }"
            @click.stop
          >
          <span
            v-if="errors.price"
            class="error"
          >{{ errors.price }}</span>
        </div>

        <div class="form-group">
          <label>Изображение (URL):</label>
          <input 
            v-model="formData.image" 
            :class="{ 'invalid': errors.image }"
            @click.stop
          >
          <span
            v-if="errors.image"
            class="error"
          >{{ errors.image }}</span>
        </div>

        <div class="button-group">
          <MyButton
            type="button"
            @click.stop="closeModal"
          >
            Отмена
          </MyButton>
          <MyButton
            type="submit"
            @click.stop
          >
            Сохранить
          </MyButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MyButton from '@/components/ui/MyButton.vue';
import type { Image } from '@/interfaces/services/Image';

const props = defineProps<{
  currentData: Image
}>();

const emit = defineEmits(['close', 'save']);

const formData = ref<Image>({ ...props.currentData });

const errors = ref({
  title: '',
  price: '',
  image: ''
});

const validateForm = () => {
  let isValid = true;
  errors.value = { title: '', price: '', image: '' };

  if (!formData.value.title.trim()) {
    errors.value.title = 'Название обязательно для заполнения';
    isValid = false;
  }

  if (!formData.value.price || 
      isNaN(formData.value.price) || 
      formData.value.price <= 0) {
    errors.value.price = 'Цена должна быть положительным числом';
    isValid = false;
  }

  try {
    new URL(formData.value.image);
  } catch {
    errors.value.image = 'Некорректный URL изображения';
    isValid = false;
  }

  return isValid;
};

watch(() => props.currentData, (newVal) => {
  formData.value = { ...newVal };
});

const closeModal = (e?: Event) => {
  e?.stopPropagation();
  emit('close');
};

const handleSubmit = (e?: Event) => {
  e?.stopPropagation();
  if (!validateForm()) return;

  const dataToSave = {
    ...formData.value,
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
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  max-width: 100%;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: space-between;
}
.button-group :first-child {
  background-color: #ff4444;
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

.error {
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.invalid {
  border-color: #ff4444 !important;
}

.invalid:focus {
  outline-color: #ff4444;
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