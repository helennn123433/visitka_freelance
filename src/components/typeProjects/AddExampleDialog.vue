<template>
  <div class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog">
      <h3>{{ dialogTitle }}</h3>
      
      <div v-if="!typeInfo" class="error-state">
        <p>Тип не найден</p>
      </div>
      
      <form v-else @submit.prevent="handleSubmit">
        <div>
          <p>Добавить пример для типа: <strong> {{ typeInfo.title }} </strong></p>
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

        <div v-if="formData.image" class="preview-section">
          <label>Предпросмотр:</label>
          <div class="preview-image">
            <img 
              :src="formData.image" 
              alt="Предпросмотр"
              @error="imageError = true"
              v-show="!imageError"
            />
            <div v-if="imageError" class="preview-error">
              Не удалось загрузить изображение
            </div>
          </div>
        </div>

        <div class="dialog-actions">
          <my-button 
            type="submit" 
            :disabled="isLoading"
            class="btn"
          >
            {{ isLoading ? 'Добавление...' : 'Добавить' }}
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
import { ref, computed, onMounted } from 'vue';
import { useSearchingStore } from '@/store/searchingStore';
import MyButton from '@/components/ui/MyButton.vue';
import type { SubserviceType } from '@/interfaces/services/Subservices';

interface Props {
  typeId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  created: [];
}>();

const searchStore = useSearchingStore();
const isLoading = ref(false);
const showValidation = ref(false);
const imageError = ref(false);

const formData = ref({
  image: '' 
});

const dialogTitle = computed(() => 'Добавить пример работы');

const typeInfo = computed<SubserviceType | null>(() => {
  for (const subservice of searchStore.subservicesData) {
    const foundType = subservice.types?.find(t => t.id === props.typeId);
    if (foundType) return foundType;
  }
  return null;
});

const validateForm = (): boolean => {
  showValidation.value = true;
  return !!(formData.value.image.trim());
};

const handleSubmit = async () => {
  if (!validateForm()) {
    alert('Введите URL изображения');
    return;
  }

  if (!props.typeId) {
    alert('Ошибка: ID типа не указан');
    return;
  }

  isLoading.value = true;
  
  try {
    await searchStore.addExample({
      typeId: props.typeId, 
      image: formData.value.image
    });
    
    emit('created');
    emit('close');
  } catch (error) {
    console.error('Ошибка при добавлении примера:', error);
    alert(error instanceof Error ? error.message : 'Произошла ошибка при добавлении');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  console.log('Открыто добавление примера для типа:', props.typeId);
  console.log('Информация о типе:', typeInfo.value);
});
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

.error-state {
  text-align: center;
  padding: 20px;
  color: #ff6b6b;
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

.form-group {
  margin-bottom: 20px;
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

.dialog-actions {
  display: flex;
  justify-content: space-evenly;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  padding: 0.5rem 1rem;
}
</style>