<template>
  <div class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog">
      <h3>{{ dialogTitle }}</h3>
      
      <div v-if="mode === 'create-subservice'" class="form-section">
        <div class="form-group">
          <label>Создание новой подуслуги для сервиса:</label>
          <input 
            :value="props.serviceId" 
            :disabled="true" 
            class="disabled-input"
          />
        </div>
        <div class="info-text">
          <p>Подуслуга будет создана с указанными ниже типами</p>
        </div>
      </div>

      <div class="types-section">
        <div class="section-header">
          <h4>{{ typesTitle }}</h4>
          <my-button
            v-if="mode === 'create-subservice'" 
            type="button" 
            @click="addTypeField"
            size="small"
            class="add-type-btn"
          >
            + Добавить тип
          </my-button>
        </div>
        
        <div 
          v-for="(type, index) in typesData" 
          :key="index"
          class="type-row"
        >
          <div class="type-fields">
            <div class="form-group">
              <label>Название типа {{ index + 1 }}:</label>
              <input 
                v-model="type.title" 
                required
                placeholder="Введите название типа"
                :class="{ 'error': !type.title && showValidation }"
              />
              <span v-if="!type.title && showValidation" class="error-message">
                Обязательное поле
              </span>
            </div>
            <div class="form-group">
              <label>URL изображения {{ index + 1 }}:</label>
              <input 
                v-model="type.image" 
                required
                placeholder="Введите URL изображения"
                :class="{ 'error': !type.image && showValidation }"
              />
              <span v-if="!type.image && showValidation" class="error-message">
                Обязательное поле
              </span>
            </div>
            <div class="form-group">
              <label>ID сервиса:</label>
              <input 
                v-model="type.serviceId" 
                :disabled="true" 
                class="disabled-input"
              />
            </div>
          </div>
          
          <div class="type-actions">
            <button 
              v-if="typesData.length > 1"
              type="button" 
              @click="removeTypeField(index)"
              class="remove-btn"
              title="Удалить тип"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="dialog-actions">
        <my-button 
          type="submit" 
          @click="handleSubmit"
          :disabled="isLoading"
          class="conf_btn"
        >
          {{ submitButtonText }}
        </my-button>
        <my-button 
          type="button" 
          @click="$emit('close')" 
          variant="secondary"
          class="go_back_btn"
        >
          Отмена
        </my-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useSearchingStore } from '@/store/searchingStore';
import MyButton from '../ui/MyButton.vue';
import type { Subservice } from '@/interfaces/services/Subservices';

interface TypeFormData {
  title: string;
  image: string;
  serviceId: string;
}

interface Props {
  serviceId: string;
  subserviceId?: string;
  mode: 'create-subservice' | 'add-types';
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  created: [subservice: Subservice];
  added: [];
}>();

const searchStore = useSearchingStore();

const typesData = ref<TypeFormData[]>([
  { 
    title: '', 
    image: '', 
    serviceId: props.serviceId 
  }
]);

const isLoading = ref(false);
const showValidation = ref(false);

const dialogTitle = computed(() => {
  return props.mode === 'create-subservice' 
    ? 'Создать подуслугу' 
    : 'Добавить тип в подуслугу';
});

const typesTitle = computed(() => {
  return props.mode === 'create-subservice' 
    ? 'Добавьте типы (минимум один)' 
    : 'Новый тип';
});

const submitButtonText = computed(() => {
  if (isLoading.value) {
    return props.mode === 'create-subservice' ? 'Создание...' : 'Добавление...';
  }
  return props.mode === 'create-subservice' ? 'Создать подуслугу' : 'Добавить тип';
});

const addTypeField = () => {
  typesData.value.push({ 
    title: '', 
    image: '', 
    serviceId: props.serviceId 
  });
};

const removeTypeField = (index: number) => {
  if (typesData.value.length > 1) {
    typesData.value.splice(index, 1);
  }
};

const validateForm = (): boolean => {
  showValidation.value = true;
  
  const isValid = typesData.value.every(type => 
    type.title.trim() !== '' && 
    type.image.trim() !== '' && 
    type.serviceId.trim() !== ''
  );
  
  return isValid;
};


const handleSubmit = async () => {
  try {
    if (!validateForm()) {
      return;
    }

    isLoading.value = true;
    
    if (props.mode === 'create-subservice') {
      const subservice = await createSubserviceWithTypes();
      emit('created', subservice);
    } else {
      if (!props.subserviceId) {
        throw new Error('ID подуслуги не указан');
      }
      
      await addTypesToSubservice();
      emit('added');
    }
    
    emit('close');
  } catch (error) {
    console.error('Ошибка:', error);
    alert(error instanceof Error ? error.message : 'Произошла ошибка');
  } finally {
    isLoading.value = false;
    showValidation.value = false;
  }
};

const createSubserviceWithTypes = async (): Promise<Subservice> => {
  try {
    const typesToAdd= typesData.value;
    
    const subservice = await searchStore.addSubservice({
      types: typesToAdd 
    });

    return subservice;
  } catch (error) {
    console.error('Ошибка в createSubserviceWithTypes:', error);
    throw error;
  }
};

const addTypesToSubservice = async () => {
  if (!props.subserviceId) {
    throw new Error('ID подуслуги не указан');
  }

  for (const type of typesData.value) {
    console.log('Добавление типа:', type);
    try {
      await searchStore.addSubserviceType(props.subserviceId, {
        title: type.title,
        image: type.image,
        serviceId: type.serviceId
      });
    } catch (error) {
      console.error('Ошибка при добавлении типа:', error);
      throw error;
    }
  }
};

watch(() => props.serviceId, (newId) => {
  typesData.value = typesData.value.map(type => ({
    ...type,
    serviceId: newId
  }));
}, { immediate: true });

watch(typesData, () => {
  if (showValidation.value) {
    showValidation.value = false;
  }
}, { deep: true });
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
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 500px;
  max-width: 700px;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.types-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.info-text {
  background-color: #f0f7ff;
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
}

.info-text p {
  margin: 0;
  font-size: 14px;
  color: #0066cc;
}

.type-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.type-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-actions {
  display: flex;
  align-items: flex-start;
}

.remove-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background: #ff5252;
}

.add-type-btn {
  margin: 0;
  padding: 1.2vh;
}

.conf_btn{
  padding: 0.5rem 1rem;
}

.go_back_btn{
  padding: 0.5rem 1rem;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 95%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group input.error {
  border-color: #ff6b6b;
}

.form-group input.error:focus {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.25);
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

.dialog-actions {
  display: flex;
  justify-content: space-evenly;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
</style>