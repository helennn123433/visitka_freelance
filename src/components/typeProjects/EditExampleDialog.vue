<template>
  <div class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog">
      <h3>{{ dialogTitle }}</h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group" v-if="availableTypes.length > 0">
          <label>Тип:</label>
          <select 
            v-model="formData.typeId" 
            required
            :class="{ 'error': !formData.typeId && showValidation }"
          >
            <option value="" disabled>Выберите тип</option>
            <option 
              v-for="type in availableTypes" 
              :key="type.id" 
              :value="type.id"
              :selected="type.id === formData.typeId"
            >
              {{ type.title }}
            </option>
          </select>
          <span v-if="!formData.typeId && showValidation" class="error-message">
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

        <div class="preview-section">
          <label>Предпросмотр:</label>
          <div class="preview-image">
            <img 
              :src="formData.image || props.exampleData.image" 
              alt="Предпросмотр"
              @error="imageError = true"
              v-show="!imageError"
            />
            <div v-if="imageError" class="preview-error">
              Не удалось загрузить изображение
            </div>
          </div>
          <div class="preview-info" v-if="props.exampleData.image && formData.image !== props.exampleData.image">
            <small>Текущее изображение будет заменено</small>
          </div>
        </div>

        <div class="dialog-actions">
          <my-button 
            type="submit" 
            :disabled="isLoading || !hasChanges"
            class="btn"
          >
            {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
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
import { ref, computed, watch } from 'vue';
import { useSearchingStore } from '@/store/searchingStore';
import MyButton from '@/components/ui/MyButton.vue';
import type { Example } from '@/interfaces/services/ServiceTypeProject';
import type { SubserviceType } from '@/interfaces/services/Subservices';

interface Props {
  exampleData: Example;
  subserviceId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [updatedExample: Example];
}>();

const searchStore = useSearchingStore();
const isLoading = ref(false);
const showValidation = ref(false);
const imageError = ref(false);

const formData = ref({
  typeId: props.exampleData.typeId,
  image: props.exampleData.image
});

const dialogTitle = computed(() => 'Редактировать пример работы');

const hasChanges = computed(() => {
  return (
    formData.value.typeId !== props.exampleData.typeId ||
    formData.value.image !== props.exampleData.image
  );
});

const availableTypes = computed<SubserviceType[]>(() => {
  const subservice = searchStore.getSubserviceById(props.subserviceId);
  return subservice?.types || [];
});

watch(() => formData.value.image, () => {
  imageError.value = false;
});

const validateForm = (): boolean => {
  showValidation.value = true;
  return !!(formData.value.typeId.trim() && formData.value.image.trim());
};

const handleSubmit = async () => {
  if (!validateForm()) {
    alert('Заполните все обязательные поля');
    return;
  }

  if (!hasChanges.value) {
    alert('Нет изменений для сохранения');
    return;
  }

  isLoading.value = true;
  
  try {
    const updateData = {
      id: props.exampleData.id,
      typeId: formData.value.typeId,
      image: formData.value.image
    };

    const updatedExample = await searchStore.updateExample(
      props.exampleData.typeId,
      props.exampleData.id,
      updateData
    );
    
    emit('updated', updatedExample);
    emit('close');
  } catch (error) {
    console.error('Ошибка при обновлении примера:', error);
    alert(error instanceof Error ? error.message : 'Произошла ошибка при обновлении');
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
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 95%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input.error,
.form-group select.error {
  border-color: #ff6b6b;
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.preview-section {
  margin: 20px 0;
}

.preview-image {
  margin-top: 10px;
  width: 200px;
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.preview-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-error {
  color: #ff6b6b;
  padding: 20px;
  text-align: center;
}

.preview-info {
  margin-top: 8px;
  font-size: 12px;
  color: #6c757d;
}

.dialog-actions {
  display: flex;
  justify-content: space-evenly;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  padding: 0.5rem 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>