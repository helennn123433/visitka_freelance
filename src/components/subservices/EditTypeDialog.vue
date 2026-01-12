<template>
  <div class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog">
      <h3>Редактировать тип</h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Название типа:</label>
          <input 
            v-model="formData.title" 
            required
            placeholder="Введите название типа"
            :class="{ 'error': !formData.title && showValidation }"
          />
          <span v-if="!formData.title && showValidation" class="error-message">
            Обязательное поле
          </span>
        </div>
        
        <div class="form-group">
          <label>URL изображения:</label>
          <input 
            v-model="formData.image" 
            required
            placeholder="Введите URL изображения"
            :class="{ 'error': !formData.image && showValidation }"
          />
          <span v-if="!formData.image && showValidation" class="error-message">
            Обязательное поле
          </span>
        </div>

        <div class="dialog-actions">
          <my-button 
            type="submit" 
            :disabled="isLoading"
            class="btn"
          >
            {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
          </my-button>
          <my-button 
            type="button" 
            @click="$emit('close')" 
            variant="secondary"
            class="btn"
          >
            Отмена
          </my-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSearchingStore } from '@/store/searchingStore';
import MyButton from '../ui/MyButton.vue';
import type { SubserviceType } from '@/interfaces/services/Subservices';

interface Props {
  typeData: SubserviceType;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const searchStore = useSearchingStore();
const isLoading = ref(false);
const showValidation = ref(false);

const formData = ref({
  title: props.typeData.title,
  image: props.typeData.image,
  serviceId: props.typeData.serviceId
});

const subserviceId = computed(() => {
  return searchStore.getSubserviceIdByTypeId(props.typeData.id) || '';
});

const validateForm = (): boolean => {
  showValidation.value = true;
  return !!(formData.value.title.trim() && formData.value.image.trim());
};

const handleSubmit = async () => {
  if (!validateForm()) {
    alert('Заполните все обязательные поля');
    return;
  }

  isLoading.value = true;
  
  try {
    if (!subserviceId.value) {
      throw new Error('Не удалось определить родительскую подуслугу');
    }

    const updates: Partial<SubserviceType> = {};
    let hasUpdates = false;

    if (formData.value.title !== props.typeData.title) {
      updates.title = formData.value.title.trim();
      hasUpdates = true;
    }

    if (formData.value.image !== props.typeData.image) {
      updates.image = formData.value.image.trim();
      hasUpdates = true;
    }

    if (hasUpdates) {
      await searchStore.updateSubserviceType(props.typeData.id, updates);
      emit('updated');
      emit('close');
    } else {
      alert('Нет изменений для сохранения');
    }
    
  } catch (error) {
    console.error('Ошибка при редактировании типа:', error);
    alert(error instanceof Error ? error.message : 'Произошла ошибка при сохранении');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.dialog-overlay {
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

.dialog {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 500px;
  max-width: 600px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 95%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input.error {
  border-color: #ff6b6b;
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.disabled-input {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #666;
}

.info-section {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #6c757d;
}

.info-section p {
  margin: 4px 0;
  font-size: 14px;
  color: #6c757d;
}

.dialog-actions {
  display: flex;
  justify-content: space-evenly;
  gap: 12px;
  margin-top: 24px;
}

.btn{
  padding: 0.5rem 1rem;
}
</style>